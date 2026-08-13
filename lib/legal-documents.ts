export type LegalDocument = {
  id: string
  label: string
  version: string
  content: string
}

export const applicationConsentRequirements = [
  {
    id: 'terms-of-use',
    label: 'Application, Membership & Engagement Terms',
    version: '2026-04-01',
  },
] as const

export type ApplicationConsentDocumentId =
  (typeof applicationConsentRequirements)[number]['id']

export const legalDocuments = [
  {
    id: 'terms-of-use',
    label: 'Application, Membership & Engagement Terms',
    version: '2026-04-01',
    content: `Expert Application, Membership & Engagement Terms

Effective Date: April 1 2026

These Expert Application, Membership & Engagement Terms (“Terms”) govern applications to, participation in, and professional engagements facilitated through the SharingMinds Expert Network.

For the purposes of these Terms, “SharingMinds”, “we”, “our” and “us” refer to SharingMinds.

By submitting an Expert application, activating an Expert Profile, participating as a SharingMinds Expert, or accepting an engagement facilitated through SharingMinds, you agree to the provisions of these Terms that apply to the relevant stage of your participation.

These Terms should be read together with the SharingMinds Privacy Policy and Expert Network Standards & Conduct Policy.

1. About SharingMinds

SharingMinds is a professional expert network designed to identify, evaluate, verify and connect experienced professionals whose expertise, practical judgment and professional experience may create value in relevant professional and organisational decision contexts.

SharingMinds may enable eligible professionals to:

- apply for consideration as SharingMinds Experts;

- undergo professional evaluation and verification;

- establish a verified professional identity within the SharingMinds ecosystem;

- represent approved areas of expertise through an Expert Profile;

- become discoverable for relevant professional requirements;

- receive potential Expert Engagement opportunities;

- participate in expert conversations, advisory engagements, programmes, workshops, roundtables and other professional formats; and

- contribute professional experience and judgment in appropriate decision contexts.

SharingMinds is a curated network.

Submission of an application does not guarantee selection, verification, membership, profile activation, engagement opportunities or remuneration.

2. Definitions

For these Terms:

Applicant

An Applicant is a professional who has submitted an application for consideration within the SharingMinds Expert Network.

Expert

An Expert is a professional accepted by SharingMinds for participation within the SharingMinds ecosystem subject to applicable verification, membership and activation requirements.

Verified Expert

A Verified Expert is an Expert whose application and relevant professional information have completed the applicable SharingMinds verification process and whose Expert status has been activated by SharingMinds.

Founding Expert

A Founding Expert is an Expert selected during a designated SharingMinds Founding Expert phase and granted Founding Expert recognition by SharingMinds.

Expert Profile

An Expert Profile is the professional identity created or maintained within SharingMinds to represent an Expert's approved experience, expertise, credentials, professional contribution and other relevant information.

Client

A Client may include a professional, founder, business, corporate organisation, institution or other eligible participant seeking relevant expertise through SharingMinds.

Expert Engagement

An Expert Engagement is a professional interaction, consultation, advisory assignment, programme, workshop, roundtable, project, discussion or other format facilitated or supported through SharingMinds.

Platform

The Platform includes the SharingMinds website, applications, digital interfaces, communications, Expert Profiles, services and related SharingMinds systems.

3. Eligibility to Apply

Applicants must:

- be at least 18 years of age;

- be legally capable of entering into applicable agreements;

- provide accurate professional and contact information;

- possess relevant professional experience, expertise or demonstrated capability;

- be legally and professionally permitted to participate in the activities for which they apply; and

- comply with these Terms and applicable SharingMinds policies.

SharingMinds may establish additional eligibility criteria for particular areas of expertise, programmes, membership categories or Expert Engagements.

Meeting basic eligibility criteria does not create an entitlement to selection.

4. Expert Application

Applicants may apply for consideration across one or more approved SharingMinds areas of expertise.

An application may request information relating to:

- professional experience;

- current and previous roles;

- industries and functions;

- areas of expertise;

- operating context;

- professional qualifications;

- responsibilities;

- decisions influenced;

- measurable professional contribution;

- projects, organisations or teams led or supported;

- professional achievements;

- supporting evidence;

- references; and

- other information reasonably relevant to Expert evaluation.

Submitting an application places the Applicant into the applicable SharingMinds evaluation process.

Submission of an application does not itself create a payment obligation.

Where any verification, membership, activation, participation or other commercial terms may apply following selection, those applicable terms will be communicated separately before they become binding on the Applicant or Expert.

5. Application Evaluation

SharingMinds may individually evaluate an application against factors including:

Relevant Professional Experience

The depth, duration, responsibility and relevance of the Applicant's professional experience.

Demonstrable Expertise

The industries, functions, markets, subjects or professional challenges in which the Applicant demonstrates meaningful capability.

Measurable Contribution

Evidence of outcomes created, problems solved, decisions influenced, organisations supported, teams led, systems built or other professional contribution.

Professional Credibility

The consistency, authenticity and verifiability of the Applicant's professional history, qualifications, credentials and body of work.

Practical Judgment

The Applicant's ability to translate professional experience into useful, responsible and contextually relevant judgment.

Relevance

The degree to which the Applicant's experience corresponds with areas of expertise, professional requirements or decision contexts supported by SharingMinds.

SharingMinds retains discretion regarding the evaluation and selection of Applicants.

SharingMinds may accept, shortlist, decline, defer or request additional information in relation to an application.

6. Verification

Shortlisted Applicants may be required to complete an appropriate verification process before becoming Verified Experts.

Verification may include review or confirmation of:

- identity;

- employment or professional history;

- qualifications and credentials;

- professional responsibilities;

- areas of expertise;

- professional achievements or contribution;

- publicly available professional information;

- supporting documents;

- professional references; and

- information supplied during the application process.

SharingMinds may also request a verification conversation or additional supporting information where reasonably necessary.

The nature and depth of verification may vary depending on the Expert's background, expertise, participation category or intended Expert Engagements.

Verification is intended to strengthen the credibility and relevance of the SharingMinds Expert Network.

Verification does not constitute a guarantee by SharingMinds regarding every statement, action, opinion, capability or future performance of an Expert.

7. Accuracy of Professional Information

Applicants and Experts must ensure that information provided to SharingMinds is accurate, complete and not misleading.

Applicants and Experts must not:

- falsify qualifications or credentials;

- materially exaggerate responsibilities or achievements;

- misrepresent employment history;

- claim expertise they do not reasonably possess;

- provide false supporting documents;

- impersonate another person; or

- knowingly omit information where the omission would make a material professional claim misleading.

Applicants and Experts must notify SharingMinds where material information relevant to their application or Expert Profile changes.

Material misrepresentation may result in rejection of an application, removal of verification, suspension of an Expert Profile or termination of participation.

8. Expert Selection

Selection as a SharingMinds Expert is not automatic.

SharingMinds may consider:

- professional experience;

- credibility;

- expertise;

- measurable contribution;

- practical judgment;

- verification findings;

- current network requirements;

- professional conduct;

- relevance to existing or anticipated demand; and

- other factors reasonably related to maintaining the quality and integrity of the Expert Network.

SharingMinds may decide not to select an Applicant even where the Applicant satisfies individual evaluation criteria.

A decision not to select an Applicant does not imply that the Applicant lacks professional capability.

9. Founding Expert Recognition

During designated founding phases, SharingMinds may select qualifying Applicants for Founding Expert recognition.

Founding Expert recognition:

- is granted only by SharingMinds;

- is subject to successful application, evaluation, verification and selection;

- is not automatically granted by submitting an application;

- may be limited by cohort, category, timing or other SharingMinds criteria;

- is personal to the selected Expert and may not be transferred; and

- may be represented through the Expert's SharingMinds profile or other approved SharingMinds interfaces.

Founding Expert recognition acknowledges participation during a designated formative phase of the SharingMinds Expert Network.

It does not guarantee any specific number, type, frequency or value of Expert Engagements.

SharingMinds may withdraw or correct Founding Expert recognition where it was obtained through material misrepresentation, where continuing eligibility requirements are no longer satisfied, or where serious conduct violations occur.

10. Expert Membership and Activation

Applicants selected for participation may receive applicable Expert membership and activation terms.

Where membership or activation requirements apply, the Expert will be provided with the relevant terms before activation.

An Expert Profile becomes active only after the applicable requirements communicated by SharingMinds have been completed.

Activation may include:

- completion of verification;

- acceptance of applicable membership terms;

- completion of the Expert Profile;

- confirmation of areas of expertise;

- completion of required declarations;

- acceptance of professional conduct requirements; and

- completion of other reasonable onboarding requirements.

Membership categories, features and participation privileges may vary.

SharingMinds may introduce or modify membership structures as the Platform develops.

Material changes applicable to an existing Expert will be communicated in accordance with these Terms.

11. Expert Profile and Professional Representation

SharingMinds may create or enable an Expert to create an Expert Profile based on information supplied during application, verification and onboarding.

An Expert Profile may contain approved information such as:

- name;

- professional photograph;

- professional headline;

- current or previous roles;

- years of experience;

- industries;

- functions;

- areas of expertise;

- professional qualifications;

- professional contribution;

- selected achievements;

- geographic or operating experience;

- verification status;

- Founding Expert or other recognition; and

- other approved professional information.

Experts are responsible for ensuring their profile information remains accurate.

SharingMinds may edit, standardise, categorise or format profile information for consistency, clarity, discoverability and Platform operation, without materially altering the meaning of the Expert's professional claims.

12. Discoverability and Expert Matching

One purpose of SharingMinds is to make relevant professional expertise easier to identify and discover.

SharingMinds may use professional information, Expert Profile information, expertise classifications and Platform systems to identify Experts who may be relevant to particular professional requirements.

Matching may consider factors including:

- expertise;

- industry experience;

- functional experience;

- operating context;

- geography;

- professional seniority;

- availability;

- engagement requirements;

- conflicts or restrictions;

- prior participation; and

- other relevant factors.

Being visible or matched within SharingMinds does not guarantee that an Expert will receive or be selected for an Expert Engagement.

13. Matching, Relevance and Suitability

SharingMinds is designed to facilitate relevant connections between Experts and Clients based on available professional information, stated requirements, areas of expertise, experience, operating context and other factors considered relevant to an Expert Engagement.

SharingMinds will use reasonable efforts, appropriate technology, available information and, where relevant, professional or human review to identify Experts whose experience and expertise appear relevant to a Client's stated requirement.

However, professional expertise, business requirements and individual suitability are inherently contextual.

Accordingly, SharingMinds does not represent, warrant or guarantee that any Expert match, recommendation, introduction or suggested engagement will be completely accurate, exhaustive, suitable or appropriate for every requirement or circumstance.

The relevance of a match may depend on information provided by Experts, Clients or other authorised sources, including information concerning:

- areas of expertise;

- professional experience;

- industry or functional background;

- professional seniority;

- operating context;

- geographic experience;

- availability;

- engagement objectives;

- Client requirements;

- conflicts or restrictions; and

- other factors relevant to the particular engagement.

SharingMinds may take reasonable steps to assess, organise, verify or evaluate information where appropriate.

However, unless expressly stated otherwise, SharingMinds does not guarantee the completeness, continuing accuracy or reliability of all information supplied by an Expert, Client or third party.

Professional circumstances, Client requirements, availability and areas of relevance may change after information has been submitted or assessed.

Matching Is a Relevance Assessment, Not a Guarantee

A SharingMinds match, recommendation or introduction indicates that, based on information reasonably available at the relevant time, there appears to be a potential relationship between an Expert's professional experience and a stated requirement.

It does not constitute:

- a guarantee of exact expertise fit;

- a guarantee of professional compatibility;

- a guarantee that the Expert possesses every capability required by the Client;

- a guarantee that the Client's requirement has been fully or accurately described;

- an endorsement of every statement made by an Expert or Client;

- a guarantee that either party will wish to proceed;

- a guarantee of an Expert Engagement;

- a guarantee of any particular outcome; or

- professional, legal, financial, investment or other regulated advice from SharingMinds.

Responsibility to Assess Suitability

Experts and Clients remain responsible for determining whether a proposed Expert Engagement is appropriate before proceeding.

An Expert should independently consider whether:

- the requirement falls within their genuine area of expertise;

- they possess sufficient relevant experience to contribute responsibly;

- they understand the scope of the proposed engagement;

- any conflict of interest exists;

- participation is permitted under their employment, contractual, fiduciary, regulatory or professional obligations; and

- they can participate without disclosing restricted or confidential information.

Clients remain responsible for assessing whether an Expert's experience, background and professional perspective are suitable for their particular requirements.

Either party may decline a proposed match or engagement where they consider the relevance, scope, suitability or circumstances inappropriate.

Technology and AI-Assisted Matching

SharingMinds may use search systems, algorithms, artificial intelligence, classification tools and other technologies to support Expert discovery and matching.

These systems may assist SharingMinds in:

- interpreting professional information;

- categorising expertise;

- identifying potential relevance;

- searching the Expert Network;

- prioritising potential Experts; and

- generating possible matches.

Technology-assisted matching is intended to support relevance and discovery rather than replace professional judgment.

Because automated systems operate on available data, classifications, contextual interpretation and probabilistic assessment, their recommendations may occasionally be incomplete, imprecise or unsuitable for a particular requirement.

Where SharingMinds considers it appropriate, technology-assisted recommendations may be supplemented by:

- human review;

- updated information;

- additional screening;

- direct clarification; or

- other relevance checks.

SharingMinds does not warrant that an automated or technology-assisted recommendation will:

- identify every potentially suitable Expert;

- exclude every unsuitable Expert;

- rank Experts with complete accuracy; or

- identify the highest-ranked Expert as necessarily the most appropriate Expert for a particular engagement.

Continuous Improvement

SharingMinds may review matching outcomes, engagement feedback, updated professional information and Platform activity to improve:

- expertise classifications;

- search functionality;

- relevance assessment;

- matching processes;

- recommendation systems; and

- the overall quality of Expert discovery.

Such improvement efforts are intended to strengthen the quality of future matching but do not create a guarantee regarding any individual match, recommendation or outcome.

No Guarantee of Engagement Outcome

Even where an Expert and Client appear highly relevant to one another, SharingMinds cannot guarantee:

- that an introduction will result in an engagement;

- that an engagement will proceed after introduction;

- that the parties will agree on scope or commercial terms;

- that the Expert's contribution will produce a particular decision or result;

- that the Client will act on the Expert's perspective; or

- that any commercial, strategic, professional or other objective will be achieved.

SharingMinds facilitates access to relevant professional expertise.

The ultimate decision to engage, participate and rely on professional perspectives remains with the relevant parties.

Nothing in this section excludes or limits any right, obligation or liability that cannot lawfully be excluded or limited under applicable law.

14. Technology and AI-Assisted Platform Functions

In addition to Expert matching, SharingMinds may use technology, algorithms and AI-assisted systems to support Platform functions including:

- expertise classification;

- profile organisation;

- search and discovery;

- relevance assessment;

- Platform personalisation;

- administrative workflows;

- communication support;

- Platform analytics; and

- other functions reasonably connected with operating and improving SharingMinds.

Technology-assisted outputs may be based on available data, classifications, contextual interpretation and automated assessment.

They are intended to support Platform operation and professional discovery and should not be understood as guarantees of accuracy, completeness, suitability or professional outcomes.

SharingMinds may combine technology-assisted systems with human review where appropriate.

Experts and Clients remain responsible for determining whether a particular engagement, recommendation or professional interaction is appropriate for them.

15. Expert Engagement Opportunities

Verified Experts may become eligible to receive relevant Expert Engagement opportunities.

Potential formats may include:

- 1:1 expert conversations;

- advisory engagements;

- structured decision programmes;

- professional consultations;

- workshops;

- roundtables;

- research-related discussions;

- strategic engagements;

- project-based participation; and

- other formats introduced by SharingMinds.

Expert Engagement opportunities depend on factors including:

- relevance;

- demand;

- availability;

- suitability;

- professional restrictions;

- Client requirements;

- geographic considerations;

- conflicts of interest; and

- other engagement-specific factors.

SharingMinds does not guarantee a minimum number, frequency, duration or monetary value of Expert Engagements.

16. Acceptance of Expert Engagements

Experts retain responsibility for determining whether to accept an Expert Engagement offered or facilitated through SharingMinds.

Before accepting an engagement, an Expert should consider:

- whether the engagement falls within the Expert's genuine area of expertise;

- whether the Expert has sufficient knowledge to contribute responsibly;

- whether a conflict of interest exists;

- whether participation is permitted under applicable employment or contractual obligations;

- whether the subject could require disclosure of restricted information;

- whether regulatory or professional restrictions apply; and

- whether the Expert can reasonably fulfil the engagement requirements.

SharingMinds may require additional confirmations before an Expert Engagement proceeds.

Experts may decline an Expert Engagement where they consider participation inappropriate.

17. Engagement-Specific Terms

Certain Expert Engagements may be subject to additional engagement-specific terms.

These may address:

- scope;

- format;

- expected contribution;

- duration;

- scheduling;

- confidentiality;

- deliverables;

- professional requirements;

- compensation where applicable;

- payment arrangements;

- cancellation or rescheduling;

- intellectual property;

- conflicts of interest;

- regulatory requirements; and

- other engagement-specific conditions.

Where additional terms apply, they will be communicated before the Expert accepts the relevant engagement.

If an engagement-specific term expressly conflicts with these Terms, the engagement-specific term will apply to that Expert Engagement to the extent of the conflict.

18. Commercial and Payment Terms

SharingMinds may offer different membership, participation and Expert Engagement structures.

Where commercial terms apply, the relevant terms will be communicated to the Expert before they become binding.

Such terms may include, where applicable:

- membership or activation terms;

- Expert Engagement compensation;

- Platform or service charges;

- transaction-related terms;

- payment schedules;

- invoicing requirements;

- tax-related documentation;

- cancellation terms; and

- other financial conditions relevant to the applicable service or engagement.

Where an Expert Engagement carries compensation, the applicable compensation or method for determining it will be communicated before the Expert accepts the engagement.

Any deductions, Platform charges or transaction-related amounts applicable to an Expert Engagement will be disclosed in accordance with the applicable engagement terms.

SharingMinds may process payments directly or through authorised payment-service providers.

19. Taxes

Experts are responsible for complying with tax obligations that apply to amounts received through or in connection with SharingMinds.

SharingMinds may:

- collect information required for taxation or financial compliance;

- issue or request appropriate invoices or documentation;

- make deductions or withholdings where required by applicable law; and

- provide transaction information where legally required.

Experts remain responsible for obtaining independent tax advice concerning their individual circumstances where required.

20. Cancellations and Rescheduling

Cancellation and rescheduling requirements may vary according to the nature of an Expert Engagement.

Where specific cancellation terms apply, they will be communicated as part of the applicable engagement terms.

Experts and Clients are expected to provide reasonable notice where an accepted engagement cannot proceed.

Repeated cancellations, non-attendance or failure to meet accepted professional commitments may affect future eligibility for Expert Engagements or continued participation within SharingMinds.

21. Expert Professional Standards

Experts must maintain professional standards consistent with the integrity of the SharingMinds Expert Network.

Experts are expected to:

- provide honest, experience-based professional perspectives;

- participate only where they possess appropriate knowledge or expertise;

- clearly distinguish professional judgment from verified fact where relevant;

- behave professionally and respectfully;

- honour accepted professional commitments;

- maintain appropriate confidentiality;

- respect third-party rights and obligations;

- disclose relevant conflicts of interest;

- avoid misleading representations;

- comply with applicable professional standards; and

- comply with applicable laws and regulations.

SharingMinds may establish additional Expert Network Standards applicable to particular categories, programmes or engagements.

22. Confidentiality

Experts may receive confidential information through SharingMinds or an Expert Engagement.

Unless disclosure is authorised or legally required, Experts must not disclose, misuse, reproduce or make available confidential information received through an Expert Engagement.

Confidential information may include:

- business information;

- commercial strategy;

- research;

- product information;

- operational information;

- financial information;

- personal information;

- Client information;

- engagement details;

- non-public documents; and

- other information reasonably understood to be confidential.

Confidentiality obligations may continue after an Expert Engagement or SharingMinds membership ends.

Specific engagements may be subject to additional confidentiality requirements.

23. Restricted Information

SharingMinds does not request or authorise Experts to disclose information they are legally, contractually, professionally or ethically prohibited from providing.

Experts must not disclose:

- confidential information belonging to a current or former employer;

- confidential Client information;

- trade secrets;

- privileged information;

- proprietary information they are not authorised to disclose;

- material non-public information;

- inside information;

- information restricted by professional duties;

- information restricted by contractual obligations; or

- any other information that the Expert is legally prohibited from sharing.

If an Expert believes an engagement would require such disclosure, the Expert must decline the relevant question, topic or engagement and, where appropriate, notify SharingMinds.

SharingMinds does not require an Expert to breach an obligation owed to an employer, former employer, Client or other third party as a condition of participating in the Platform.

24. Conflicts of Interest

Experts are responsible for identifying and disclosing actual or potential conflicts of interest relevant to an Expert Engagement.

A conflict may arise from:

- current employment;

- previous employment;

- advisory relationships;

- board positions;

- investments;

- Client relationships;

- contractual obligations;

- competitive relationships;

- financial interests; or

- other circumstances capable of materially affecting independence or participation.

SharingMinds may determine that an Expert should not participate in a particular engagement where a conflict exists or may reasonably be perceived to exist.

Experts must not accept an engagement where participation would violate a legal, contractual, fiduciary or professional obligation.

25. Independent Professional Judgment

Experts participate in SharingMinds based on their own professional experience and judgment.

Experts must not present SharingMinds as endorsing a particular professional opinion, recommendation or conclusion unless expressly authorised.

Unless expressly agreed otherwise, an Expert's views are their own and do not represent the views of:

- SharingMinds;

- the Expert's employer;

- a former employer;

- a Client; or

- another organisation.

Clients remain responsible for their own decisions.

Expert perspectives provided through SharingMinds are intended to contribute relevant professional experience and judgment and should not automatically be treated as a substitute for regulated legal, financial, medical or other professional advice where specialised professional advice is required.

26. Employment, Agency and Authority

Participation as a SharingMinds Expert does not by itself create an employment relationship, partnership, joint venture, agency or fiduciary relationship between the Expert and SharingMinds.

Unless SharingMinds expressly authorises otherwise in writing, Experts have no authority to:

- bind SharingMinds;

- enter contracts on behalf of SharingMinds;

- make commitments on behalf of SharingMinds; or

- represent that they are employees or authorised agents of SharingMinds.

An Expert's professional relationship with SharingMinds is governed by the applicable membership and engagement terms.

27. Intellectual Property of SharingMinds

The SharingMinds Platform, including its branding, trademarks, technology, software, visual design, platform architecture, original content and proprietary materials, is owned by or lawfully used by SharingMinds.

Except where expressly permitted, users may not:

- copy;

- reproduce;

- distribute;

- modify;

- commercially exploit;

- reverse engineer;

- imitate; or

- create derivative works from

SharingMinds proprietary materials without appropriate authorisation.

Nothing in these Terms transfers ownership of SharingMinds intellectual property to an Applicant, Expert or Client.

28. Expert-Owned Content

Experts retain ownership of professional content and materials they lawfully own and submit to SharingMinds.

By submitting professional information or content, the Expert grants SharingMinds a non-exclusive licence to host, process, organise, reproduce, display and use that information as reasonably necessary to:

- evaluate the Expert application;

- complete verification;

- operate the Expert Profile;

- provide Platform functionality;

- facilitate search and discoverability;

- identify relevant professional opportunities;

- facilitate Expert Engagements;

- maintain Platform records; and

- otherwise provide SharingMinds services.

This licence does not transfer ownership of the Expert's underlying intellectual property to SharingMinds.

Experts must ensure they have the right to submit any material provided to SharingMinds.

SharingMinds may seek separate permission where an Expert's name, image, testimonial or professional content is proposed for use in standalone promotional or marketing material beyond ordinary Expert Profile and Platform representation.

29. Personal Information and Privacy

SharingMinds may collect and process personal and professional information required to:

- evaluate applications;

- perform verification;

- establish Expert Profiles;

- operate membership;

- facilitate Expert matching and engagements;

- administer communications;

- process transactions where applicable;

- maintain Platform security;

- comply with legal requirements; and

- operate and improve SharingMinds.

Personal information will be handled in accordance with the SharingMinds Privacy Policy and applicable law.

Applicants and Experts should review the Privacy Policy for further information regarding data collection, use, sharing, retention, rights and contact procedures.

30. Communications

By participating in SharingMinds, Applicants and Experts may receive communications reasonably related to:

- applications;

- evaluation;

- verification;

- Expert Profile administration;

- membership;

- activation;

- potential Expert Engagements;

- accepted engagements;

- Platform operations;

- security;

- policy changes;

- account administration; and

- other service-related matters.

Marketing or promotional communications will be managed in accordance with applicable law and SharingMinds communication preferences.

Applicants and Experts are responsible for maintaining accurate contact information.

31. Platform Integrity and Prohibited Conduct

Applicants and Experts must not:

- provide fraudulent or misleading information;

- impersonate another person;

- misuse another person's credentials;

- interfere with Platform security;

- attempt unauthorised access;

- introduce malicious software;

- scrape or systematically extract Platform data without authorisation;

- misuse confidential Client or Expert information;

- engage in harassment or discrimination;

- use SharingMinds for unlawful activities;

- circumvent required Platform processes where prohibited;

- misuse payment or verification systems;

- exploit SharingMinds relationships through fraud or misrepresentation; or

- otherwise act in a manner that materially threatens the integrity of the Expert Network.

SharingMinds may investigate suspected violations and take appropriate action.

32. No Guarantee of Opportunities or Outcomes

Matching and relevance are subject to Section 13 — Matching, Relevance and Suitability.

SharingMinds is intended to improve the ability of relevant expertise and professional requirements to discover one another.

However, SharingMinds does not guarantee:

- selection as an Expert;

- verification;

- Expert Profile activation;

- continuous membership;

- visibility to any particular Client;

- the accuracy or suitability of every match;

- any minimum number of matches;

- Expert Engagement opportunities;

- engagement acceptance by a Client;

- any particular level of compensation;

- business, career, investment or other outcomes; or

- results arising from an Expert Engagement.

Opportunities may vary significantly according to expertise, demand, geography, availability, relevance, Client requirements and other factors.

A match, recommendation or introduction does not itself constitute an assurance that an Expert Engagement will occur or that any particular result will follow.

33. Suspension, Restriction and Termination

SharingMinds may restrict, suspend or terminate an application, Expert Profile, membership or participation where reasonably necessary because of:

- material misrepresentation;

- failed or incomplete verification;

- violation of these Terms;

- violation of Expert Network Standards;

- serious professional misconduct;

- confidentiality breaches;

- conflicts or legal restrictions;

- misuse of the Platform;

- fraud or security concerns;

- non-compliance with applicable engagement requirements; or

- legal or regulatory requirements.

Where appropriate, SharingMinds may seek clarification before taking action.

Experts may request closure of their Expert Profile or membership subject to applicable outstanding obligations.

Termination does not automatically cancel obligations that are intended to survive termination, including confidentiality, intellectual property, outstanding payment, dispute and legal compliance obligations.

34. Platform Availability

SharingMinds may introduce, modify, suspend or discontinue Platform features, programmes, participation formats or services as the network develops.

SharingMinds will take reasonable measures to maintain Platform operation but does not guarantee uninterrupted or error-free availability.

Temporary interruptions may occur because of maintenance, security requirements, technology failures, third-party services or circumstances outside reasonable control.

35. Disclaimer

SharingMinds facilitates access to professional expertise and Expert Engagements but does not guarantee the accuracy, completeness or suitability of every opinion, statement, professional perspective, recommendation or other information provided by an Expert, Client or other Platform participant.

SharingMinds may undertake evaluation, verification, matching and other quality processes as described in these Terms, but such processes do not constitute a guarantee that:

- every professional claim will remain accurate;

- every Expert will be suitable for every engagement;

- every Client requirement will be complete;

- every match will be exact;

- every professional perspective will be correct; or

- any particular result will be achieved.

Experts remain responsible for the professional perspectives they provide.

Clients remain responsible for evaluating information received and making their own decisions.

Except where expressly stated in applicable engagement terms or required by law, SharingMinds does not assume responsibility for decisions made solely in reliance on an Expert's views.

36. Limitation of Liability

To the maximum extent permitted by applicable law, SharingMinds will not be liable for indirect, incidental, special or consequential loss arising solely from:

- use of the Platform;

- an Expert match or recommendation;

- an introduction between an Expert and Client;

- participation in an Expert Engagement;

- information supplied by an Expert or Client; or

- decisions made following an Expert Engagement,

except where liability cannot legally be excluded or limited.

Nothing in these Terms excludes or limits liability where such exclusion or limitation is prohibited by applicable law.

Any engagement-specific allocation of responsibility expressly agreed between the relevant parties will apply to that engagement.

37. Responsibility for Breach

Applicants and Experts are responsible for losses or claims resulting from their own:

- fraud;

- intentional misconduct;

- material misrepresentation;

- unlawful conduct;

- unauthorised disclosure of confidential information; or

- infringement of third-party rights.

SharingMinds reserves the right to take reasonable steps to protect the Platform, Clients, Experts and the integrity of the network where such conduct occurs.

38. Changes to These Terms

SharingMinds may update these Terms to reflect:

- changes to Platform functionality;

- new Expert programmes;

- membership developments;

- engagement formats;

- matching or technology developments;

- legal or regulatory requirements;

- security requirements; or

- operational changes.

Where changes materially affect existing Experts, SharingMinds will provide appropriate notice.

Continued participation after revised Terms become effective may constitute acceptance where permitted by applicable law.

Where separate acceptance is legally or operationally required, SharingMinds may request renewed confirmation.

39. Relationship With Other SharingMinds Policies

These Terms should be read together with applicable SharingMinds policies, including:

- SharingMinds Privacy Policy

- Expert Network Standards & Conduct Policy

- Cookie Policy, where applicable

- engagement-specific terms, where applicable

- programme-specific terms, where applicable

If an engagement-specific agreement expressly conflicts with these Terms, the engagement-specific provision will govern the relevant engagement to the extent of that conflict.

40. Governing Law and Jurisdiction

These Terms are governed by the laws of India.

Subject to any dispute-resolution process specifically agreed between SharingMinds and the relevant party, courts of competent jurisdiction in Mumbai, Maharashtra, India will have jurisdiction over disputes arising from or relating to these Terms.

41. Severability

If any provision of these Terms is found to be invalid, unlawful or unenforceable, the remaining provisions will continue to apply to the fullest extent permitted by law.

Where reasonably possible, the affected provision will be interpreted or modified so that its intended commercial purpose can be preserved lawfully.

42. No Waiver

A failure or delay by SharingMinds to exercise a right under these Terms does not constitute a waiver of that right.

A waiver relating to one circumstance does not automatically apply to another circumstance.

43. Entire Understanding

These Terms, together with applicable SharingMinds policies and any expressly accepted membership, programme or engagement-specific terms, constitute the applicable understanding between SharingMinds and the Expert regarding participation in the SharingMinds Expert Network.

44. Contact

Questions regarding these Terms may be directed to:

Email: support@sharingminds.in

Additional contact channels may be made available through the SharingMinds Platform.

Expert Application Declaration

By submitting my SharingMinds Expert application, I confirm that:

1. The information and supporting materials I have provided are accurate, complete and fairly represent my professional background, experience and expertise.

2. I understand that submission of an application does not guarantee selection, verification, membership, Expert Profile activation, Founding Expert recognition or access to Expert Engagements.

3. I understand that SharingMinds may review information supplied in my application and may request reasonable supporting information relating to my professional experience, qualifications, credentials, contribution or other professional claims.

4. I understand that additional information, references, supporting documents or a verification conversation may be requested before a selection decision is made.

5. I confirm that I have the right to provide the information and materials submitted with my application.

6. I agree not to provide confidential, restricted, proprietary or other information that I am not authorised to disclose.

7. I agree to notify SharingMinds if material information supplied in my application changes before a final selection decision is made.

8. I understand that SharingMinds may use available information, technology, AI-assisted systems and, where relevant, professional or human review to evaluate expertise and identify potentially relevant professional opportunities.

9. I understand that a SharingMinds match, recommendation or introduction represents an assessment of potential relevance and does not guarantee exact suitability, compatibility, an Expert Engagement or any particular outcome.

10. If selected, I understand that applicable verification, membership, activation and participation terms may be provided before my Expert Profile is activated.

11. I understand that any applicable commercial terms connected with membership, activation or a specific Expert Engagement will be communicated before they become binding.

12. I agree to comply with the SharingMinds Expert Application, Membership & Engagement Terms, Privacy Policy and applicable Expert Network Standards.

I confirm that I have read and understood the above declaration and wish to submit my application for consideration by SharingMinds.`,
  },
  {
    id: 'privacy-policy',
    label: 'Privacy Policy',
    version: '2026-04-01',
    content: `Privacy Policy | SharingMinds

Effective Date: April 1 2026
A Product of SoftWeb Networks

1. Our Commitment to Privacy

At SoftWeb Networks, your privacy is our priority.This Privacy Policy explains how we collect, use, and protect information you share while using the
SharingMinds Platform.

2. Information We Collect

We collect the following data when you use our Platform:

Personal Information: Name, email, phone number, occupation, expertise, and mentor/mentee details.

Usage Data: Device type, IP address, browser data, and pages visited.

Session Information: Booking details, progress notes, and communication data related to mentorship sessions.

3. How We Use Your Information

We use your information to:

Create and manage your account.

Facilitate mentor-mentee matching and communication.

Process payments and subscriptions.

Improve the Platform experience and personalize content.

Send relevant updates, newsletters, or support information (with your consent).

Ensure compliance with legal and security standards.

We do not sell, rent, or trade your data with third parties.

4. Data Sharing

We may share data only with:

Trusted service providers under confidentiality agreements.

Legal authorities when required by law.

Partners assisting in platform analytics or communication, under strict privacy safeguards.

5. Data Protection

Your data is stored securely using industry-standard encryption and security practices.While we take reasonable measures to safeguard your data, no system is 100% secure, and users share data at their own risk.

6. Your Rights

You have the right to:

Access, correct, or delete your personal data.

Withdraw consent or opt out of marketing communications.

Request data portability or account closure by contacting us.

Requests can be made via privacy@sharingminds.in

7. Cookies and Tracking

We use cookies and analytics tools to enhance user experience and understand usage patterns.You can manage cookie preferences in your browser settings.

8. AI and Personalization

SharingMinds may use AI algorithms to recommend mentors, improve user engagement, and personalize your experience — always within ethical and privacy standards.

9. Policy Updates

We may modify this Privacy Policy periodically. Updates will be posted here, and continued use of the Platform implies acceptance of the revised policy.

10. Contact

For privacy-related questions:
📧 privacy@sharingminds.in`,
  },
  {
    id: 'pricing-policy',
    label: 'Pricing Policy',
    version: '2026-04-01',
    content: `Pricing Policy | SharingMinds

Effective Date: April 1 2026
A Product of SoftWeb Networks

1. Overview

This Pricing Policy outlines the fee structure and payment terms for mentors and mentees using the SharingMinds Platform.

2. Mentor Verification Fee

All mentors undergo a one-time verification process to ensure credibility and authenticity.

Standard verification fee: Waived off for Founding Mentors under our early-access program. Applicable against personal invitation only.

3. Platform Subscription

Verified mentors subscribe to an annual plan that provides:

Full platform access

AI-based mentee matching

Dashboard analytics & progress tracking

Profile visibility & marketing features

Subscription fees are displayed during onboarding and may vary by region or access tier.

4. Mentee Bookings & Payments

Mentees can book paid mentorship sessions or packages directly through the platform.Mentors set their own session fees, while
SharingMinds may retain a small service fee to cover transaction and platform costs.

5. Payment Terms

Payments are processed securely via authorized gateways.

Subscription renewals are billed annually in advance.

Notifications are sent 30 days before renewal.

Payments are non-refundable once access is activated, except under exceptional cases.

6. Refunds & Cancellations

Refunds are considered only if:

A session is cancelled prior to mentor confirmation.

Technical issues prevent participation in a confirmed session.Refunds are processed within
7–10 business days to the original payment method.

7. Pricing Updates

Soft Web Network reserves the right to revise prices or introduce new service tiers.Users will be notified in advance through email or dashboard alerts.

8. Contact

For pricing or billing support:
📧 billing@softwebnetworks.com`,
  },
  {
    id: 'community-conduct-policy',
    label: 'Expert Network Standards & Conduct Policy',
    version: '2026-04-01',
    content: `Community & Conduct Policy | SharingMinds

Effective Date: April 1 2026
A Product of SoftWeb Networks

Our Commitment

At SharingMinds, we believe mentorship thrives in an environment built on trust, respect, and authenticity.This Community & Conduct Policy defines the standards expected from everyone engaging on the platform — mentors, mentees, partners, and contributors.

By joining SharingMinds, you agree to uphold these principles and maintain the integrity of our growing community.

1️⃣ Respectful Interaction

Treat all members with courtesy and respect, regardless of background, gender, beliefs, or experience.

No abusive, discriminatory, or harassing language or behavior will be tolerated.

Constructive disagreement is welcome; personal attacks are not.

2️⃣ Professional Integrity

Mentors must provide honest, experience-based guidance — not promotional or misleading claims.

Mentees must use sessions for learning and growth, not solicitation or personal gain.

SharingMinds prohibits any activity that exploits, manipulates, or misrepresents others.

3️⃣ Confidentiality

Information shared during mentorship sessions must remain strictly confidential unless both parties consent to disclosure.

Recording, publishing, or redistributing mentorship content without consent is prohibited.

4️⃣ Authentic Profiles

All users must provide accurate information in their profiles.

Falsifying professional credentials or using fake identities can result in account suspension or removal.

5️⃣ Ethical & Legal Conduct

Use the platform only for lawful, ethical, and professional purposes.

Do not post or distribute content that is defamatory, infringing, or violates intellectual property rights.

Any form of harassment, solicitation, or financial fraud is grounds for immediate termination.

6️⃣ Platform Integrity

Do not attempt to bypass SharingMinds’ booking, payment, or verification systems.

Avoid spamming, mass messaging, or any unauthorized data extraction from the platform.

7️⃣ Reporting & Resolution

Users can report misconduct or policy violations by emailing support@sharingminds.in

SharingMinds and SoftWeb Networks may investigate and take corrective action, including warnings, suspension, or permanent removal.

8️⃣ Consequences of Violation

SharingMinds and SoftWeb Networks reserves the right to restrict access or terminate accounts that violate these policies, with or without prior notice, to preserve community integrity.

9️⃣ Updates to This Policy

This policy may be updated periodically to reflect new features or compliance requirements.Continued use of the platform implies acceptance of any updated version.

Contact

For concerns or feedback regarding this policy, please contact:
📧 community@sharingminds.in`,
  },
  {
    id: 'cookie-policy',
    label: 'Cookie Policy',
    version: '2026-04-01',
    content: `Cookie Policy

Effective Date: April 1 2026

This Cookie Policy explains how SharingMinds uses cookies and similar technologies when you visit or use the SharingMinds website, Platform, Expert application process and related digital services.

For the purposes of this Cookie Policy, “SharingMinds”, “we”, “our” and “us” refer to SharingMinds.

This Cookie Policy should be read together with the SharingMinds Privacy Policy and other applicable SharingMinds terms.

1. What Are Cookies?

Cookies are small data files that may be stored on or accessed through your browser or device when you visit a website or use an online service.

Cookies and similar technologies can help websites:

- function securely;

- recognise a browser or device;

- maintain sessions;

- remember preferences;

- preserve application progress;

- understand how users interact with the Platform;

- improve performance and functionality; and

- measure the effectiveness of communications or campaigns.

Similar technologies may include local storage, session storage, pixels, tags, software development kits and other technologies performing comparable functions.

References to “cookies” in this Policy include these similar technologies where appropriate.

2. How SharingMinds Uses Cookies

SharingMinds may use cookies and similar technologies to support:

- secure Platform operation;

- account authentication;

- Expert application functionality;

- preservation of application progress;

- session management;

- security and fraud prevention;

- user preferences;

- Platform performance;

- website and application analytics;

- understanding user journeys;

- improving Platform functionality;

- measuring application and engagement activity;

- communication and campaign attribution, where applicable; and

- compliance with legal or regulatory requirements.

We seek to use cookies in a manner appropriate to their purpose and in accordance with applicable law.

3. Types of Cookies We May Use

A. Strictly Necessary Cookies

Strictly Necessary Cookies support functions required for the SharingMinds Platform to operate securely and effectively.

They may be used for:

- account authentication;

- secure login;

- maintaining user sessions;

- protecting accounts and Platform security;

- preventing fraudulent or malicious activity;

- preserving Expert application progress;

- maintaining application-session continuity;

- remembering privacy or cookie choices; and

- enabling other core Platform functionality.

Without these technologies, certain SharingMinds functions may not operate correctly.

Where permitted by applicable law, Strictly Necessary Cookies may operate without optional consent because they are required to provide or secure the requested Platform functionality.

B. Functional and Preference Cookies

Functional Cookies may help SharingMinds provide a more consistent or personalised Platform experience.

They may remember information such as:

- language preferences;

- interface preferences;

- previously selected options;

- display settings;

- account-related preferences; and

- other choices made during Platform use.

Disabling these cookies may affect certain convenience or personalisation features.

C. Analytics and Performance Cookies

SharingMinds may use analytics and performance technologies to understand how users interact with the Platform.

These technologies may help us understand:

- pages visited;

- navigation patterns;

- time spent on particular pages;

- application journey progression;

- points at which users leave or continue an application;

- Platform errors;

- browser and device categories;

- general traffic sources;

- feature usage;

- website performance; and

- aggregated Platform usage trends.

SharingMinds may use this information to improve:

- Expert onboarding;

- application workflows;

- Platform usability;

- website performance;

- content relevance;

- navigation;

- user experience; and

- Platform functionality.

Where required, these technologies will be subject to applicable cookie or consent preferences.

D. Advertising, Campaign and Attribution Cookies

Where SharingMinds conducts digital campaigns or measures the effectiveness of professional outreach, we may use advertising, attribution or campaign-measurement technologies.

These technologies may help us understand:

- whether a visitor reached SharingMinds through a particular campaign;

- which communication or source resulted in a Platform visit;

- whether a campaign contributed to an Expert application;

- aggregated campaign performance;

- conversion activity; and

- the effectiveness of professional outreach.

These technologies may be operated by SharingMinds or authorised third-party service providers.

Where required by applicable law, such technologies will operate according to the user's applicable cookie or consent preferences.

SharingMinds does not intend this category to imply that every advertising or tracking technology is active on the Platform at all times.

4. Expert Application Continuity

SharingMinds may use necessary cookies or similar technologies to support the Expert application process.

These technologies may be used to:

- maintain a secure application session;

- recognise an authenticated Applicant;

- preserve application progress;

- prevent accidental loss of application information;

- enable Applicants to continue an application where this functionality is available;

- protect application information from unauthorised access; and

- support the reliability of the application process.

These technologies are intended to support the functionality and security of Expert onboarding.

5. Application Journey and Conversion Analytics

SharingMinds may analyse aggregated or appropriately managed information relating to the Expert onboarding journey in order to improve the application experience.

This may include understanding movement between stages such as:

Platform Visit → Expert Application → Application Progress → Submission

Such analysis may help SharingMinds identify:

- unnecessary application friction;

- technical problems;

- application abandonment points;

- usability issues;

- page-performance problems; and

- opportunities to improve the Expert onboarding experience.

Where cookies or similar technologies used for this purpose require a user choice under applicable law, SharingMinds will respect the applicable preference.

6. First-Party and Third-Party Cookies

Cookies may be placed or managed either by SharingMinds or by authorised third-party service providers.

First-Party Cookies

First-party cookies are associated directly with SharingMinds and may support functions such as:

- authentication;

- security;

- application sessions;

- preferences; and

- Platform functionality.

Third-Party Cookies

Third-party technologies may be provided by service providers supporting functions such as:

- analytics;

- website infrastructure;

- security;

- authentication;

- communications;

- performance monitoring;

- payment processing;

- campaign measurement; or

- other Platform services.

The availability and use of particular third-party services may change as SharingMinds develops.

Where appropriate, third-party technologies may also be governed by the privacy or cookie practices of the relevant service provider.

7. Information That Cookies May Collect

Depending on the technology and purpose, cookies may process information such as:

- device identifiers;

- browser type;

- operating system;

- IP address;

- approximate location derived from technical information;

- session identifiers;

- login status;

- pages visited;

- interaction events;

- referral source;

- date and time information;

- Platform preferences;

- application-stage information;

- technical error information; and

- other similar usage or technical information.

Not every cookie collects all of these categories.

SharingMinds will use information collected through cookies in accordance with the applicable purpose and the SharingMinds Privacy Policy.

8. Cookies and Personal Information

Information generated through cookies may in some circumstances constitute or be associated with personal information.

Where this occurs, SharingMinds will handle that information in accordance with the SharingMinds Privacy Policy and applicable data-protection requirements.

Cookie-generated information may be combined with other Platform information where reasonably necessary to:

- secure an account;

- maintain application continuity;

- operate the Platform;

- improve Platform functionality;

- understand Platform usage;

- provide requested services; or

- meet legal or security obligations.

9. Cookie Preferences

Where SharingMinds provides a cookie-preference tool, users may be able to choose whether certain non-essential categories of cookies are enabled.

Available controls may include options such as:

- Accept All

- Reject Non-Essential

- Manage Preferences

The exact controls available may depend on the technologies operating on the Platform and applicable legal requirements.

Users may generally change available cookie preferences after their initial selection through the cookie-preference mechanism made available by SharingMinds.

10. Necessary Cookies and User Choices

Certain cookies are necessary for:

- Platform security;

- authentication;

- account operation;

- application-session continuity;

- fraud prevention; or

- other essential Platform functions.

Because these technologies support requested or necessary functionality, disabling them may prevent certain parts of SharingMinds from operating correctly.

Non-essential technologies will be managed in accordance with applicable preference and consent requirements.

11. Browser Controls

Most web browsers allow users to manage cookies through browser settings.

Depending on the browser, users may be able to:

- view stored cookies;

- delete cookies;

- block cookies;

- restrict third-party cookies; or

- receive notifications when cookies are placed.

Changing browser settings may affect the operation of SharingMinds.

For example, blocking necessary cookies may interfere with:

- login;

- secure sessions;

- Expert applications;

- account functionality; or

- saved Platform preferences.

Users should refer to their browser's own settings or support information for available controls.

12. Cookie Duration

Cookies may operate for different periods depending on their purpose.

Session Cookies

Session cookies generally operate during a browser or Platform session and may expire after the session ends.

They may support:

- authentication;

- secure navigation;

- application continuity; and

- temporary Platform functions.

Persistent Cookies

Persistent cookies may remain for a defined period after a session ends.

They may support:

- preferences;

- recognised settings;

- analytics;

- security;

- campaign attribution; or

- other permitted Platform functions.

SharingMinds seeks to retain cookies only for periods reasonably appropriate to their purpose, subject to applicable legal, security and operational requirements.

13. Security

SharingMinds takes reasonable measures designed to protect information processed through the Platform.

Cookies used for authentication, security or application continuity may form part of those safeguards.

However, no online service, browser technology or transmission method can be guaranteed to be completely secure.

Users are responsible for maintaining the security of their own devices, browsers, passwords and login credentials.

14. Third-Party Websites and Services

SharingMinds may contain links to websites or services operated by third parties.

When users leave SharingMinds and access a third-party service, that service may use its own cookies or tracking technologies.

SharingMinds does not control the cookie practices of independent third-party websites.

Users should review the applicable privacy and cookie information provided by those third parties.

15. Payments and Transaction Technologies

Where SharingMinds enables payments or financial transactions, authorised payment-service providers may use cookies or similar technologies necessary to:

- process transactions;

- authenticate payments;

- prevent fraud;

- maintain transaction security; and

- comply with legal or financial requirements.

Payment-service providers may process information according to their own applicable privacy and security practices.

SharingMinds does not use this Cookie Policy to alter or override the obligations of an independent payment-service provider.

16. Changes to Technologies Used by SharingMinds

The technologies used by SharingMinds may change as the Platform develops.

We may:

- introduce new Platform functionality;

- replace service providers;

- modify analytics tools;

- improve security systems;

- introduce new application functionality; or

- change campaign-measurement technologies.

Where these changes materially affect how cookies or similar technologies are used, SharingMinds may update this Cookie Policy or the available cookie-preference controls.

17. Updates to This Cookie Policy

SharingMinds may update this Cookie Policy periodically to reflect:

- changes in Platform functionality;

- changes in technologies used;

- changes to service providers;

- security developments;

- legal or regulatory requirements; or

- changes in SharingMinds practices.

The current version will be made available through the SharingMinds Platform with its applicable Effective Date.

Where required, SharingMinds may provide additional notice of material changes.

18. Relationship With Other SharingMinds Policies

This Cookie Policy should be read together with the applicable SharingMinds legal framework, including:

- SharingMinds Privacy Policy

- SharingMinds Expert Application, Membership & Engagement Terms

- Expert Network Standards & Conduct Policy

- other applicable Platform or engagement-specific terms.

Where personal information is processed through cookies or similar technologies, the SharingMinds Privacy Policy provides additional information regarding the handling of that personal information.

19. Contact

Questions or requests regarding this Cookie Policy or SharingMinds cookie practices may be directed to:

Email: privacy@sharingminds.in

Additional privacy or preference-management options may be made available through the SharingMinds Platform.

Cookie Preference Statement

Where applicable, SharingMinds may display a cookie preference notice substantially reflecting the following principle:

SharingMinds uses necessary technologies to operate and secure the Platform. With your applicable preferences, we may also use analytics and other technologies to understand Platform usage, improve the Expert application experience and measure relevant communications or campaigns.

Users may be provided with appropriate controls to Accept All, Reject Non-Essential, or Manage Preferences, depending on the technologies in use and applicable requirements.`,
  },
] as const satisfies readonly LegalDocument[]

export type LegalDocumentId = (typeof legalDocuments)[number]['id']

export const applicationConsentDocuments = legalDocuments.filter(
  document => document.id === 'terms-of-use',
)
