"use client"

import { type FocusEvent, useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Crown, Star } from "lucide-react"

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

import {
  type FoundingExpertProfile as FoundingExpertProfileData,
  foundingExpertProfiles,
} from "./founding-expert-data"

const ROTATION_INTERVAL_MS = 5600

type ProfileCardProps = {
  profile: FoundingExpertProfileData
}

function ProfileCard({ profile }: ProfileCardProps) {
  const titleId = `founding-profile-${profile.id}`

  return (
    <article
      aria-labelledby={titleId}
      className="relative overflow-hidden rounded-[22px] border border-[#d59b36]/80 bg-white/72 p-4 pb-[62px] shadow-[0_18px_42px_rgba(113,72,14,0.13)] backdrop-blur-sm sm:p-5 sm:pb-[62px] lg:h-[clamp(214px,27vh,250px)] lg:p-[clamp(14px,1.35vw,20px)] 2xl:flex 2xl:h-[clamp(214px,27vh,280px)] 2xl:flex-col 2xl:justify-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(242,195,92,0.2),transparent_30%),linear-gradient(110deg,rgba(255,255,255,0.5),transparent_55%)]" />
      <span className="absolute right-8 top-0 hidden h-14 w-9 items-center justify-center bg-[linear-gradient(180deg,#f7d477,#c88a20)] text-[#8b5a08] shadow-[0_8px_14px_rgba(116,73,10,0.2)] sm:flex">
        <Star className="h-4 w-4 fill-current" aria-hidden="true" />
        <span className="absolute -bottom-2 h-4 w-4 rotate-45 bg-[#c88a20]" />
      </span>

      <div className="relative grid gap-4 sm:grid-cols-[122px_minmax(0,1fr)_152px] sm:items-center lg:grid-cols-[clamp(102px,9vw,128px)_minmax(0,1fr)_clamp(126px,12vw,160px)]">
        <div className="relative mx-auto h-[112px] w-[112px] sm:h-[122px] sm:w-[122px] lg:h-[clamp(102px,9vw,128px)] lg:w-[clamp(102px,9vw,128px)]">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_35deg,#f0c45a,#9b620e,#f7df91,#b57714,#f0c45a)] p-[3px] shadow-[0_12px_24px_rgba(87,55,7,0.22)]">
            <div className="relative h-full w-full overflow-hidden rounded-full border-[5px] border-[#092348] bg-[#102f59]">
              <Image
                src={profile.image}
                alt={profile.imageAlt}
                fill
                sizes="(min-width: 1024px) 128px, 122px"
                className="object-cover object-center"
              />
            </div>
          </div>
          <span className="absolute -bottom-1 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#f1cf79] bg-[#071d3d] text-[#e5ad34]">
            <Crown className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>

        <div className="min-w-0 text-center sm:text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#aa6b12] lg:text-[11px]">
            {profile.eyebrow}
          </p>
          <h3
            id={titleId}
            className="mt-1 text-[clamp(21px,1.8vw,30px)] font-semibold leading-[1.04] tracking-[-0.025em] text-[#0a2148]"
          >
            {profile.title}
          </h3>
          <p className="mt-1 text-[12px] font-medium leading-snug text-[#263b57] lg:text-[13px]">
            {profile.disciplines}
          </p>

          <ul className="mt-3 grid gap-1.5 text-left sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-[0.7fr_1.45fr_1.2fr]">
            {profile.attributes.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex items-center justify-center gap-1.5 text-[11px] text-[#31445c] sm:justify-start lg:text-[10px] xl:text-[11px]"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-[#c8841b]" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto flex min-h-[126px] w-full max-w-[170px] flex-col items-center justify-center overflow-hidden rounded-[22px] border-2 border-[#d69a2b] bg-[linear-gradient(160deg,#12335f,#051a38_72%)] px-4 py-4 text-center text-[#f8d77c] shadow-[0_14px_26px_rgba(5,26,56,0.22)]">
          <div className="absolute inset-2 rounded-[16px] border border-[#f1c865]/45" />
          <Crown className="relative h-7 w-7 fill-[#e7b84d]/20" aria-hidden="true" />
          <p className="relative mt-2 text-[16px] font-semibold uppercase leading-none tracking-[0.04em]">
            Founding
            <span className="mt-1 block">Expert</span>
          </p>
          <span className="relative mt-2 border-t border-[#e8c367]/55 pt-1.5 text-[8px] font-semibold uppercase tracking-[0.17em] text-[#fff4d6]">
            Early Contributor
          </span>
        </div>
      </div>

      <ul className="relative mt-4 flex flex-wrap justify-center gap-2 sm:justify-start lg:mt-3 lg:pr-48">
        {profile.specialisms.map((specialism) => (
          <li
            key={specialism}
            className="rounded-full border border-[#d7ad62]/70 bg-[#fffaf0]/82 px-3 py-1 text-[10px] font-medium text-[#173053] lg:px-2.5"
          >
            {specialism}
          </li>
        ))}
      </ul>
    </article>
  )
}

export function FoundingExpertProfile() {
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isFocusWithin, setIsFocusWithin] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const handleSelect = useCallback((carouselApi: NonNullable<CarouselApi>) => {
    setSelectedIndex(carouselApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReduceMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener("change", updatePreference)

    return () => mediaQuery.removeEventListener("change", updatePreference)
  }, [])

  useEffect(() => {
    if (!api) return

    handleSelect(api)
    api.on("select", handleSelect)
    api.on("reInit", handleSelect)

    return () => {
      api.off("select", handleSelect)
      api.off("reInit", handleSelect)
    }
  }, [api, handleSelect])

  useEffect(() => {
    if (!api || reduceMotion) return

    const timer = window.setInterval(() => api.scrollNext(), ROTATION_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [api, reduceMotion, selectedIndex])

  const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget
    if (!nextTarget || !event.currentTarget.contains(nextTarget as Node)) {
      setIsFocusWithin(false)
    }
  }, [])

  const activeProfile = foundingExpertProfiles[selectedIndex] ?? foundingExpertProfiles[0]

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
        duration: reduceMotion ? 1 : 24,
      }}
      aria-label="Representative founding expert profiles"
      className="group/profile-carousel w-full min-w-0 max-w-full"
      onFocusCapture={() => setIsFocusWithin(true)}
      onBlurCapture={handleBlur}
    >
      <CarouselContent className="-ml-0">
        {foundingExpertProfiles.map((profile, index) => (
          <CarouselItem
            key={profile.id}
            className="pl-0"
            aria-label={`${index + 1} of ${foundingExpertProfiles.length}`}
            aria-hidden={index !== selectedIndex}
          >
            <ProfileCard profile={profile} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div
        className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[#d3a24e]/70 bg-[#fffaf0]/95 p-1.5 shadow-[0_8px_22px_rgba(90,56,8,0.16)] backdrop-blur-md lg:left-auto lg:right-4 lg:translate-x-0"
        aria-label="Founding expert profile carousel controls"
      >
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#173053] transition-colors hover:bg-[#f2d996] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a66a10]"
          aria-label="Show previous representative profile"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1" aria-label="Choose a representative profile">
          {foundingExpertProfiles.map((profile, index) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-1.5 rounded-full bg-[#c8a35d]/55 transition-[width,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a66a10] focus-visible:ring-offset-2",
                index === selectedIndex ? "w-5 bg-[#b97813]" : "w-1.5 hover:bg-[#b98937]",
              )}
              aria-label={`Show ${profile.title}`}
              aria-current={index === selectedIndex ? "true" : undefined}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => api?.scrollNext()}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#173053] transition-colors hover:bg-[#f2d996] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a66a10]"
          aria-label="Show next representative profile"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p
        className="sr-only"
        aria-live={isFocusWithin ? "polite" : "off"}
        aria-atomic="true"
      >
        Showing representative profile {selectedIndex + 1} of {foundingExpertProfiles.length}:{" "}
        {activeProfile.title}
      </p>
    </Carousel>
  )
}
