/**
 * Availability Validation Utility
 *
 * Shared between client (WeeklyScheduleEditor) and server (API routes).
 * Handles time-block overlap detection, merging, and schedule validation.
 */

export interface TimeBlock {
    startTime: string; // "HH:MM"
    endTime: string;   // "HH:MM"
    type: 'AVAILABLE' | 'BREAK' | 'BUFFER' | 'BLOCKED';
    maxBookings?: number;
}

export interface TimeBlockOverlap {
    block: TimeBlock;
    overlapType: 'full' | 'contains' | 'contained' | 'partial';
    overlapMinutes: number;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    overlaps: TimeBlockOverlap[];
}

export interface WeeklyScheduleValidation {
    isValid: boolean;
    errors: { day: number; errors: string[] }[];
}

// ── Helpers ──

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// ── checkTimeBlockOverlap ──

/**
 * Checks if two time blocks overlap and returns detailed overlap info.
 */
export function checkTimeBlockOverlap(
    block1: TimeBlock,
    block2: TimeBlock
): TimeBlockOverlap | null {
    const start1 = timeToMinutes(block1.startTime);
    const end1 = timeToMinutes(block1.endTime);
    const start2 = timeToMinutes(block2.startTime);
    const end2 = timeToMinutes(block2.endTime);

    // No overlap
    if (end1 <= start2 || end2 <= start1) return null;

    // Calculate overlap minutes
    const overlapStart = Math.max(start1, start2);
    const overlapEnd = Math.min(end1, end2);
    const overlapMinutes = overlapEnd - overlapStart;

    // Determine overlap type
    let overlapType: TimeBlockOverlap['overlapType'];

    if (start1 === start2 && end1 === end2) {
        overlapType = 'full';
    } else if (start1 <= start2 && end1 >= end2) {
        overlapType = 'contains';
    } else if (start2 <= start1 && end2 >= end1) {
        overlapType = 'contained';
    } else {
        overlapType = 'partial';
    }

    return {
        block: block2,
        overlapType,
        overlapMinutes,
    };
}

// ── validateTimeBlock ──

/**
 * Validates a single time block against existing blocks on the same day.
 *
 * @param newBlock - The block to validate
 * @param existingBlocks - Other blocks on the same day
 * @param allowedOverlapTypes - Block types that are allowed to overlap (e.g. BREAK over AVAILABLE)
 */
export function validateTimeBlock(
    newBlock: TimeBlock,
    existingBlocks: TimeBlock[],
    allowedOverlapTypes?: TimeBlock['type'][]
): ValidationResult {
    const errors: string[] = [];
    const overlaps: TimeBlockOverlap[] = [];

    // 1. Validate time format
    if (!TIME_REGEX.test(newBlock.startTime)) {
        errors.push(`Invalid start time format: "${newBlock.startTime}". Expected HH:MM.`);
    }
    if (!TIME_REGEX.test(newBlock.endTime)) {
        errors.push(`Invalid end time format: "${newBlock.endTime}". Expected HH:MM.`);
    }

    if (errors.length > 0) {
        return { isValid: false, errors, overlaps };
    }

    // 2. Validate end > start
    const startMin = timeToMinutes(newBlock.startTime);
    const endMin = timeToMinutes(newBlock.endTime);

    if (endMin <= startMin) {
        errors.push(`End time (${newBlock.endTime}) must be after start time (${newBlock.startTime}).`);
        return { isValid: false, errors, overlaps };
    }

    // 3. Check for minimum block duration (15 minutes)
    if (endMin - startMin < 15) {
        errors.push('Time block must be at least 15 minutes long.');
    }

    // 4. Check overlaps with existing blocks
    for (const existing of existingBlocks) {
        const overlap = checkTimeBlockOverlap(newBlock, existing);
        if (overlap) {
            // Skip if the overlap is with an allowed type
            if (allowedOverlapTypes && allowedOverlapTypes.includes(existing.type)) {
                continue;
            }
            overlaps.push(overlap);
            errors.push(
                `Overlaps with existing ${existing.type} block (${existing.startTime}–${existing.endTime}) by ${overlap.overlapMinutes} minutes.`
            );
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        overlaps,
    };
}

// ── mergeAndSortTimeBlocks ──

/**
 * Sorts blocks by start time, then merges adjacent/overlapping AVAILABLE blocks
 * (only if they have the same maxBookings value).
 */
export function mergeAndSortTimeBlocks(blocks: TimeBlock[]): TimeBlock[] {
    if (blocks.length <= 1) return [...blocks];

    // Sort by start time
    const sorted = [...blocks].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    const merged: TimeBlock[] = [];
    let current = { ...sorted[0] };

    for (let i = 1; i < sorted.length; i++) {
        const next = sorted[i];
        const currentEnd = timeToMinutes(current.endTime);
        const nextStart = timeToMinutes(next.startTime);

        // Merge if:
        // - Both are AVAILABLE
        // - They are adjacent or overlapping
        // - Same maxBookings
        if (
            current.type === 'AVAILABLE' &&
            next.type === 'AVAILABLE' &&
            nextStart <= currentEnd &&
            current.maxBookings === next.maxBookings
        ) {
            // Extend current block
            const nextEnd = timeToMinutes(next.endTime);
            if (nextEnd > currentEnd) {
                current.endTime = next.endTime;
            }
        } else {
            merged.push(current);
            current = { ...next };
        }
    }
    merged.push(current);

    return merged;
}

// ── applyBlockedTimes ──

/**
 * Takes available blocks and "subtracts" blocked/break periods by fragmenting
 * the available blocks around blocked ones.
 *
 * Used by slot-generation APIs to calculate effective availability.
 */
export function applyBlockedTimes(
    availableBlocks: TimeBlock[],
    blockedBlocks: TimeBlock[]
): TimeBlock[] {
    if (blockedBlocks.length === 0) return [...availableBlocks];

    const result: TimeBlock[] = [];

    for (const available of availableBlocks) {
        // Start with the full available block as a fragment
        let fragments: { start: number; end: number }[] = [
            {
                start: timeToMinutes(available.startTime),
                end: timeToMinutes(available.endTime),
            },
        ];

        // For each blocked period, split any overlapping fragments
        for (const blocked of blockedBlocks) {
            const blockedStart = timeToMinutes(blocked.startTime);
            const blockedEnd = timeToMinutes(blocked.endTime);

            const newFragments: { start: number; end: number }[] = [];

            for (const frag of fragments) {
                // No overlap — keep fragment as-is
                if (frag.end <= blockedStart || frag.start >= blockedEnd) {
                    newFragments.push(frag);
                    continue;
                }

                // Fragment starts before blocked → keep left piece
                if (frag.start < blockedStart) {
                    newFragments.push({ start: frag.start, end: blockedStart });
                }

                // Fragment ends after blocked → keep right piece
                if (frag.end > blockedEnd) {
                    newFragments.push({ start: blockedEnd, end: frag.end });
                }
            }

            fragments = newFragments;
        }

        // Convert fragments back to TimeBlocks
        for (const frag of fragments) {
            if (frag.end - frag.start >= 15) {
                // Only keep fragments ≥ 15 minutes
                result.push({
                    startTime: minutesToTime(frag.start),
                    endTime: minutesToTime(frag.end),
                    type: 'AVAILABLE',
                    maxBookings: available.maxBookings,
                });
            }
        }
    }

    return mergeAndSortTimeBlocks(result);
}

// ── validateWeeklySchedule ──

/**
 * Validates an entire weekly schedule by checking each day's blocks
 * for internal overlaps.
 */
export function validateWeeklySchedule(
    weeklyPatterns: { dayOfWeek: number; isEnabled: boolean; timeBlocks: TimeBlock[] }[]
): WeeklyScheduleValidation {
    const dayErrors: { day: number; errors: string[] }[] = [];
    let isValid = true;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (const pattern of weeklyPatterns) {
        if (!pattern.isEnabled || pattern.timeBlocks.length === 0) continue;

        const errors: string[] = [];

        for (let i = 0; i < pattern.timeBlocks.length; i++) {
            const block = pattern.timeBlocks[i];
            const otherBlocks = pattern.timeBlocks.filter((_, index) => index !== i);
            const validation = validateTimeBlock(block, otherBlocks);

            if (!validation.isValid) {
                errors.push(
                    ...validation.errors.map(
                        (err) => `${dayNames[pattern.dayOfWeek]}: ${block.startTime}–${block.endTime} — ${err}`
                    )
                );
            }
        }

        if (errors.length > 0) {
            isValid = false;
            dayErrors.push({ day: pattern.dayOfWeek, errors });
        }
    }

    return { isValid, errors: dayErrors };
}
