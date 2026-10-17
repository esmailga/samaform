import type { Language } from './translations';

// A paragraph, or a bulleted list
export type LegalBlock = string | { list: string[] };
export type LegalSection = { id: string; title: string; body: LegalBlock[] };
export type LegalDocument = { intro: string[]; sections: LegalSection[] };

type LegalContent = {
  labels: { updated: string; contents: string; questions: string; questionsDesc: string; email: string; phone: string; address: string };
  updated: string;
  terms: LegalDocument;
  privacy: LegalDocument;
};

export const legal: Record<Language, LegalContent> = {
  en: {
    labels: {
      updated: 'Last updated',
      contents: 'On this page',
      questions: 'Questions about this policy?',
      questionsDesc: 'Contact us and we will be happy to help.',
      email: 'Email',
      phone: 'Phone',
      address: 'Studio',
    },
    updated: '17 October 2026',

    terms: {
      intro: [
        'These Terms of Service (the “Terms”) govern your access to and use of the SAMAFORM website, including the “Record Your Plan” form and any other features, content or communications offered through it (together, the “Website”).',
        'Please read these Terms carefully. By accessing or using the Website, you confirm that you have read, understood and agree to be bound by them. If you do not agree, please do not use the Website.',
      ],
      sections: [
        {
          id: 'about-us',
          title: 'Who we are',
          body: [
            'The Website is operated by SAMAFORM, an architecture and interior design studio based at the 6th floor, Alshalal Tower, Al Asbahi St., Sana’a, Republic of Yemen (“SAMAFORM”, “we”, “us” or “our”).',
            'You can contact us at any time using the details in the “Contact us” section at the end of these Terms.',
          ],
        },
        {
          id: 'eligibility',
          title: 'Who may use the Website',
          body: [
            'You may browse the Website freely. To submit a project request through “Record Your Plan”, you must be at least 18 years old, or have the permission and supervision of a parent or legal guardian.',
            'If you submit a request on behalf of a company, organisation or another person, you confirm that you are authorised to do so and to accept these Terms on their behalf.',
          ],
        },
        {
          id: 'acceptable-use',
          title: 'Acceptable use',
          body: [
            'You agree to use the Website lawfully, respectfully and only for its intended purpose: learning about our work and contacting us about architecture and interior design projects. In particular, you agree not to:',
            {
              list: [
                'provide information that is false, misleading or that belongs to someone else without their permission;',
                'upload files that contain viruses, malicious code, or anything other than genuine images related to your project;',
                'upload content that is unlawful, offensive, defamatory, or that infringes anyone’s intellectual property, privacy or other rights;',
                'attempt to gain unauthorised access to the Website, its administration area, servers or databases, or interfere with their security or operation;',
                'use automated tools (such as bots, scrapers or crawlers) to copy, collect or extract content or data from the Website without our written permission;',
                'submit repeated, automated or bulk requests, or otherwise use the Website in a way that could damage, disable or overload it;',
                'copy, reproduce or redistribute our designs, images or other content except as permitted in these Terms.',
              ],
            },
            'We may remove any content and refuse, suspend or restrict access to the Website for anyone who breaches these Terms.',
          ],
        },
        {
          id: 'project-requests',
          title: 'Project requests through “Record Your Plan”',
          body: [
            '“Record Your Plan” lets you describe your project and share reference images so that we can understand your needs. When you submit a request:',
            {
              list: [
                'you agree to provide accurate and complete information, and to let us know if anything changes;',
                'your submission is a request for us to contact you. It does not create a contract or an obligation for either of us to work together;',
                'we will review your request and may contact you to discuss it, ask for more details, arrange a meeting or site visit, or explain why we are unable to take it on;',
                'any budget ranges, timelines or feedback we give before a written agreement is signed are preliminary estimates only. They are not binding quotations and may change once we fully understand the project.',
              ],
            },
            'We may decline any request at our discretion, for example if it falls outside our services, schedule or location.',
          ],
        },
        {
          id: 'your-content',
          title: 'Images and content you send us',
          body: [
            'You keep ownership of the images and other content you upload or send us (“Your Content”). By submitting Your Content, you confirm that you own it or have permission to share it with us, and that it does not infringe anyone else’s rights.',
            'You give us permission to store, view, copy and use Your Content for the purpose of reviewing your request, preparing proposals and designs, and communicating with you about your project. We will not publish Your Content, or images of your property, in our portfolio or on social media without your separate consent.',
            'Please avoid uploading images that show identity documents, financial information, or people who have not agreed to be photographed.',
          ],
        },
        {
          id: 'services',
          title: 'Our design services',
          body: [
            'Information on the Website describes the services we generally offer. The scope, deliverables, fees, schedule, payment terms and ownership of designs for any actual project will be set out in a separate written agreement between you and SAMAFORM.',
            'If there is any conflict between these Terms and a signed project agreement, the project agreement will prevail for that project.',
          ],
        },
        {
          id: 'intellectual-property',
          title: 'Intellectual property',
          body: [
            'The Website and everything on it, including architectural and interior designs, concepts, drawings, 3D models, renders, photographs, text, graphics, our name and logo, and the design of the Website itself, are owned by SAMAFORM or our licensors and are protected by intellectual property laws.',
            'You may view the Website and share links to it for your personal, non-commercial use. You may not copy, reproduce, modify, distribute, publish, sell or create works based on any of our content, or use our name or logo, without our prior written permission.',
            'Viewing a design on the Website does not give you any right to build, reproduce or adapt it.',
          ],
        },
        {
          id: 'portfolio',
          title: 'Portfolio and project images',
          body: [
            'Projects shown on the Website may include completed works as well as concept designs and computer-generated renders. Images are for illustration only: finishes, materials, colours, furniture and landscaping in a finished project may differ, and the images are not an offer to deliver an identical result.',
          ],
        },
        {
          id: 'third-parties',
          title: 'Third-party services and links',
          body: [
            'The Website links to or includes services provided by third parties, such as Instagram, Facebook and Google Maps. These services are not controlled by us and are governed by their own terms and privacy policies. We are not responsible for their content, availability or practices, and a link does not mean we endorse them.',
          ],
        },
        {
          id: 'disclaimer',
          title: 'Disclaimer',
          body: [
            'We work to keep the Website accurate, available and secure, but it is provided “as is” and “as available”. To the fullest extent permitted by law, we do not guarantee that the Website will be uninterrupted, error-free or free of harmful components, or that its content is complete or up to date.',
            'Content on the Website is general information about our work. It is not professional advice for your specific site or project, which always requires a proper assessment, and you should not rely on it as such.',
          ],
        },
        {
          id: 'liability',
          title: 'Limitation of liability',
          body: [
            'To the fullest extent permitted by applicable law, SAMAFORM will not be liable for any indirect, incidental, special or consequential loss, or for any loss of profit, revenue, data or business opportunity, arising from your use of, or inability to use, the Website.',
            'Our responsibility for services we provide under a project agreement is governed by that agreement. Nothing in these Terms limits or excludes any liability that cannot be limited or excluded by law.',
          ],
        },
        {
          id: 'indemnity',
          title: 'Your responsibility',
          body: [
            'You agree to compensate SAMAFORM for any claims, losses or costs (including reasonable legal fees) that arise from your breach of these Terms, from Your Content, or from your misuse of the Website.',
          ],
        },
        {
          id: 'changes',
          title: 'Changes to the Website and these Terms',
          body: [
            'We may update, change or withdraw any part of the Website at any time. We may also update these Terms from time to time, for example to reflect changes to our services or to the law. The “Last updated” date at the top of this page shows when they were last changed.',
            'Changes take effect when they are published on this page. If you continue to use the Website after that, you accept the updated Terms.',
          ],
        },
        {
          id: 'law',
          title: 'Governing law and disputes',
          body: [
            'These Terms are governed by the laws of the Republic of Yemen. If a dispute arises, we encourage you to contact us first so that we can try to resolve it amicably. Any dispute that cannot be resolved this way will be subject to the jurisdiction of the competent courts in Sana’a.',
          ],
        },
        {
          id: 'general',
          title: 'General',
          body: [
            {
              list: [
                'These Terms are available in Arabic and English. If there is any inconsistency between the two versions, the Arabic version will prevail.',
                'If any part of these Terms is found to be invalid or unenforceable, the rest will remain in full effect.',
                'If we do not enforce any part of these Terms straight away, this does not mean we have waived our right to do so later.',
                'These Terms, together with our Privacy Policy, form the entire agreement between you and SAMAFORM about your use of the Website.',
              ],
            },
          ],
        },
        {
          id: 'contact',
          title: 'Contact us',
          body: [
            'If you have any questions about these Terms, please contact us using the details below.',
          ],
        },
      ],
    },

    privacy: {
      intro: [
        'Your privacy matters to us. This Privacy Policy explains what personal information SAMAFORM collects when you use our website and contact us, why we collect it, how we use, share and protect it, and the choices and rights you have.',
        'This policy applies to the SAMAFORM website, including the “Record Your Plan” form (together, the “Website”), and to the communications you have with us about a potential project. By using the Website, you acknowledge that you have read this policy.',
      ],
      sections: [
        {
          id: 'who-we-are',
          title: 'Who is responsible for your information',
          body: [
            'SAMAFORM, an architecture and interior design studio based at the 6th floor, Alshalal Tower, Al Asbahi St., Sana’a, Republic of Yemen, is responsible for the personal information described in this policy (“SAMAFORM”, “we”, “us” or “our”).',
          ],
        },
        {
          id: 'information-we-collect',
          title: 'Information we collect',
          body: [
            'Information you give us through “Record Your Plan”:',
            {
              list: [
                'Contact details: your full name, phone number, city and, if you choose to provide it, your email address.',
                'Project details: the type of space (for example, an apartment, villa, shop, restaurant, office or salon), budget range or amount, area, timeline, design and architectural style, priorities, room and floor counts, and any other answers you select.',
                'Your descriptions: anything you write in the free-text fields about your vision, requirements or preferences.',
                'Images: inspiration images and photos of your current space that you choose to upload.',
                'The date and time of your submission.',
              ],
            },
            'Information you give us in other ways: when you email us, call us, message us on social media or meet us, we keep the information you share, such as your name, contact details and the content of your messages.',
            'Information collected automatically: like most websites, the servers that host the Website automatically record technical information when you visit, such as your IP address, browser and device type, the pages you request, and the date and time. This is used to deliver the Website, keep it secure and fix problems.',
            'We do not use analytics, advertising or tracking tools on the Website, and we do not build profiles of visitors.',
          ],
        },
        {
          id: 'sensitive-information',
          title: 'Information we do not ask for',
          body: [
            'We do not need, and ask you not to send us, sensitive information such as identity documents, bank or card details, health information, or information about religious or political beliefs. Please also take care that the photos you upload do not show people who have not agreed to share their image, or private documents.',
          ],
        },
        {
          id: 'how-we-use',
          title: 'How we use your information',
          body: [
            'We use your information only for the purposes below:',
            {
              list: [
                'to review your request and understand your project, space and requirements;',
                'to contact you about your request, answer your questions and arrange meetings or site visits;',
                'to prepare preliminary estimates, proposals, quotations and designs;',
                'to deliver and manage your project if we go on to work together;',
                'to keep internal records of the requests we receive and to improve our services and the Website;',
                'to protect the Website, our clients and our business against fraud, abuse and security threats;',
                'to comply with our legal obligations and to establish or defend legal claims.',
              ],
            },
            'We will not send you marketing messages unless you have asked us to, and you can ask us to stop at any time. We do not make decisions about you using fully automated processes.',
          ],
        },
        {
          id: 'legal-basis',
          title: 'Why we are allowed to use it',
          body: [
            'We use your personal information because:',
            {
              list: [
                'you have asked us to, by submitting a request or contacting us (and, where we rely on your consent, you can withdraw it at any time);',
                'it is needed to take steps you have requested before entering into a contract, or to perform a contract with you;',
                'it is in our legitimate interests to run, secure and improve our business and the Website, in a way that does not override your rights; or',
                'we are required to by law.',
              ],
            },
          ],
        },
        {
          id: 'cookies',
          title: 'Cookies and similar technologies',
          body: [
            'The Website itself does not set advertising or analytics cookies. Your language choice is not stored and resets when you leave. The administration area, used only by SAMAFORM staff, keeps a login session in the browser’s local storage.',
            'Some features rely on third-party services that may receive your IP address or set their own cookies:',
            {
              list: [
                'Google Fonts: the Website’s font is delivered by Google, which receives your IP address in order to send the font to your browser.',
                'Google Maps: the map on our Contact page is provided by Google, which may set cookies and collect information according to its own privacy policy.',
              ],
            },
            'You can control or delete cookies through your browser settings. Blocking them may affect how the embedded map works.',
          ],
        },
        {
          id: 'sharing',
          title: 'How we share your information',
          body: [
            'We do not sell, rent or trade your personal information. We share it only where necessary and only with:',
            {
              list: [
                'members of the SAMAFORM team who need it to handle your request or project;',
                'service providers who help us run our business, such as website hosting, email and IT providers, who may only use it to provide their services to us;',
                'engineers, consultants, contractors or suppliers involved in your project, but only with your agreement and only what they need;',
                'professional advisers, such as lawyers and accountants, where reasonably necessary;',
                'public authorities, courts or regulators, where we are required to by law or to protect our rights, our clients or the public;',
                'a successor or buyer, if our business or part of it is reorganised, merged or sold, subject to this policy.',
              ],
            },
          ],
        },
        {
          id: 'transfers',
          title: 'Where your information is stored',
          body: [
            'Your information is stored on the servers that host the Website and in the systems we use to communicate with you. Some of these providers, and third-party services such as Google, may store or process information outside the Republic of Yemen. Where this happens, we take reasonable steps to ensure your information remains protected in line with this policy.',
          ],
        },
        {
          id: 'retention',
          title: 'How long we keep your information',
          body: [
            'We keep personal information only for as long as we need it for the purposes described in this policy:',
            {
              list: [
                'Requests that do not lead to a project are kept for as long as needed to respond and follow up with you, after which we delete them or anonymise them so they no longer identify you.',
                'If we work together, we keep project records for the duration of the project and for as long afterwards as is required by law, for our professional obligations, or to deal with any claims.',
                'You can ask us to delete your information sooner at any time (see “Your rights” below).',
              ],
            },
          ],
        },
        {
          id: 'security',
          title: 'How we protect your information',
          body: [
            'We use appropriate technical and organisational measures to protect your information against loss, misuse and unauthorised access. These include restricting access to submitted requests to authorised staff through a password-protected administration area, and only accepting genuine image files through our upload forms.',
            'No method of transmitting or storing information over the internet is completely secure, so we cannot guarantee absolute security. If we become aware of a security incident that affects your information, we will take prompt steps to address it and will inform you where required.',
          ],
        },
        {
          id: 'your-rights',
          title: 'Your rights',
          body: [
            'Subject to applicable law, you have the right to:',
            {
              list: [
                'ask whether we hold information about you and receive a copy of it;',
                'ask us to correct information that is inaccurate or incomplete;',
                'ask us to delete your information;',
                'object to, or ask us to limit, how we use your information;',
                'withdraw your consent at any time, where we rely on it;',
                'ask us to provide your information in a commonly used format.',
              ],
            },
            'To make a request, contact us using the details below. We may need to confirm your identity before responding. We will reply within a reasonable time, and normally within 30 days. If we cannot fully meet your request, for example because we must keep certain records by law, we will explain why.',
          ],
        },
        {
          id: 'children',
          title: 'Children',
          body: [
            'The Website is intended for adults. We do not knowingly collect personal information from anyone under 18. If you believe a child has sent us their information, please contact us and we will delete it.',
          ],
        },
        {
          id: 'external-links',
          title: 'Other websites',
          body: [
            'The Website contains links to other websites and services, such as our Instagram and Facebook pages and Google Maps. This policy does not apply to them. We encourage you to read their privacy policies before sharing information with them.',
          ],
        },
        {
          id: 'changes',
          title: 'Changes to this policy',
          body: [
            'We may update this Privacy Policy from time to time, for example if we change how we handle information or add new features to the Website. The “Last updated” date at the top of this page shows when it was last changed. If we make significant changes, we will make this clear on the Website.',
          ],
        },
        {
          id: 'contact',
          title: 'Contact us',
          body: [
            'If you have any questions about this policy or how we handle your information, or wish to exercise your rights, please contact us using the details below.',
          ],
        },
      ],
    },
  },

  ar: {
    labels: {
      updated: 'آخر تحديث',
      contents: 'محتويات الصفحة',
      questions: 'هل لديك أسئلة حول هذه السياسة؟',
      questionsDesc: 'تواصل معنا ويسعدنا مساعدتك.',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      address: 'الاستوديو',
    },
    updated: '١٧ أكتوبر ٢٠٢٦',

    terms: {
      intro: [
        'تنظّم شروط الخدمة هذه («الشروط») وصولك إلى موقع سما فورم الإلكتروني واستخدامك له، بما في ذلك نموذج «ابدأ مشروعك» وأي ميزات أو محتوى أو مراسلات أخرى تُقدَّم من خلاله (ويُشار إليها مجتمعةً بـ«الموقع»).',
        'يُرجى قراءة هذه الشروط بعناية. بدخولك إلى الموقع أو استخدامك له، فإنك تؤكد أنك قرأت هذه الشروط وفهمتها ووافقت على الالتزام بها. وإذا كنت لا توافق عليها، فيُرجى عدم استخدام الموقع.',
      ],
      sections: [
        {
          id: 'about-us',
          title: 'من نحن',
          body: [
            'يُدار هذا الموقع من قِبل سما فورم، وهو استوديو للتصميم المعماري والداخلي يقع في الدور السادس، برج الشلال، شارع الأصبحي، صنعاء، الجمهورية اليمنية («سما فورم» أو «نحن» أو ضمير المتكلم).',
            'يمكنك التواصل معنا في أي وقت عبر بيانات الاتصال الواردة في قسم «تواصل معنا» في نهاية هذه الشروط.',
          ],
        },
        {
          id: 'eligibility',
          title: 'من يحق له استخدام الموقع',
          body: [
            'يمكنك تصفّح الموقع بحرية. أما لتقديم طلب مشروع عبر نموذج «ابدأ مشروعك»، فيجب ألا يقل عمرك عن ١٨ عاماً، أو أن تحصل على إذن أحد الوالدين أو الوصي القانوني وتحت إشرافه.',
            'وإذا قدّمت طلباً نيابةً عن شركة أو جهة أو شخص آخر، فإنك تؤكد أنك مخوَّل بذلك وبقبول هذه الشروط نيابةً عنه.',
          ],
        },
        {
          id: 'acceptable-use',
          title: 'الاستخدام المقبول',
          body: [
            'توافق على استخدام الموقع بصورة قانونية ولائقة وللغرض المخصص له فقط، وهو التعرّف على أعمالنا والتواصل معنا بشأن مشاريع التصميم المعماري والداخلي. وعلى وجه الخصوص، توافق على ألّا تقوم بما يلي:',
            {
              list: [
                'تقديم معلومات كاذبة أو مضللة، أو معلومات تخص شخصاً آخر دون إذنه؛',
                'رفع ملفات تحتوي على فيروسات أو شيفرات ضارة، أو أي ملفات غير الصور الحقيقية المتعلقة بمشروعك؛',
                'رفع محتوى مخالف للقانون أو مسيء أو تشهيري، أو ينتهك حقوق الملكية الفكرية أو الخصوصية أو أي حقوق أخرى لأي شخص؛',
                'محاولة الوصول غير المصرح به إلى الموقع أو منطقة إدارته أو خوادمه أو قواعد بياناته، أو التدخل في أمنها أو تشغيلها؛',
                'استخدام أدوات آلية (مثل الروبوتات أو برامج جمع البيانات) لنسخ المحتوى أو البيانات من الموقع أو جمعها أو استخراجها دون إذن كتابي منا؛',
                'إرسال طلبات متكررة أو آلية أو جماعية، أو استخدام الموقع بأي طريقة قد تؤدي إلى إتلافه أو تعطيله أو إثقاله؛',
                'نسخ تصاميمنا أو صورنا أو أي محتوى آخر لنا أو إعادة إنتاجه أو توزيعه، إلا في الحدود المسموح بها في هذه الشروط.',
              ],
            },
            'يحق لنا إزالة أي محتوى، ورفض وصول أي شخص يخالف هذه الشروط إلى الموقع أو تعليقه أو تقييده.',
          ],
        },
        {
          id: 'project-requests',
          title: 'طلبات المشاريع عبر «ابدأ مشروعك»',
          body: [
            'يتيح لك نموذج «ابدأ مشروعك» وصف مشروعك ومشاركة صور مرجعية لنتمكن من فهم احتياجاتك. وعند تقديمك طلباً:',
            {
              list: [
                'توافق على تقديم معلومات دقيقة وكاملة، وعلى إبلاغنا بأي تغيير يطرأ عليها؛',
                'يُعدّ طلبك دعوةً لنا للتواصل معك، ولا يُنشئ عقداً أو التزاماً على أيٍّ منا بالعمل معاً؛',
                'سنراجع طلبك، وقد نتواصل معك لمناقشته أو طلب مزيد من التفاصيل أو ترتيب اجتماع أو زيارة للموقع، أو لتوضيح سبب عدم تمكّننا من تنفيذه؛',
                'تُعدّ أي نطاقات للميزانية أو جداول زمنية أو ملاحظات نقدّمها قبل توقيع اتفاقية مكتوبة تقديرات أولية فقط، وليست عروض أسعار ملزمة، وقد تتغير بعد فهمنا الكامل للمشروع.',
              ],
            },
            'يحق لنا رفض أي طلب وفقاً لتقديرنا، كأن يكون خارج نطاق خدماتنا أو جدول أعمالنا أو منطقتنا الجغرافية.',
          ],
        },
        {
          id: 'your-content',
          title: 'الصور والمحتوى الذي ترسله إلينا',
          body: [
            'تظل ملكية الصور وأي محتوى آخر ترفعه أو ترسله إلينا («محتواك») لك. وبتقديمك محتواك، فإنك تؤكد أنك تملكه أو لديك إذن بمشاركته معنا، وأنه لا ينتهك حقوق أي طرف آخر.',
            'وتمنحنا الإذن بتخزين محتواك والاطلاع عليه ونسخه واستخدامه لغرض دراسة طلبك وإعداد العروض والتصاميم والتواصل معك بشأن مشروعك. ولن ننشر محتواك أو صور عقارك في معرض أعمالنا أو على وسائل التواصل الاجتماعي دون موافقة منفصلة منك.',
            'يُرجى تجنّب رفع صور تُظهر وثائق الهوية أو المعلومات المالية أو أشخاصاً لم يوافقوا على تصويرهم.',
          ],
        },
        {
          id: 'services',
          title: 'خدماتنا التصميمية',
          body: [
            'تصف المعلومات الواردة في الموقع الخدماتِ التي نقدمها بشكل عام. أما نطاق العمل والمخرجات والأتعاب والجدول الزمني وشروط الدفع وملكية التصاميم لأي مشروع فعلي، فتُحدَّد في اتفاقية مكتوبة منفصلة بينك وبين سما فورم.',
            'وفي حال وجود أي تعارض بين هذه الشروط واتفاقية مشروع موقّعة، تسري أحكام اتفاقية المشروع فيما يخص ذلك المشروع.',
          ],
        },
        {
          id: 'intellectual-property',
          title: 'الملكية الفكرية',
          body: [
            'الموقع وكل ما يتضمنه، بما في ذلك التصاميم المعمارية والداخلية والمفاهيم والرسومات والنماذج ثلاثية الأبعاد والصور المُنشأة حاسوبياً والصور الفوتوغرافية والنصوص والرسوم واسمنا وشعارنا وتصميم الموقع نفسه، مملوك لسما فورم أو للجهات المرخِّصة لها، ومحمي بموجب قوانين الملكية الفكرية.',
            'يمكنك تصفّح الموقع ومشاركة روابطه لاستخدامك الشخصي غير التجاري. ولا يجوز لك نسخ أي من محتوانا أو إعادة إنتاجه أو تعديله أو توزيعه أو نشره أو بيعه أو إنشاء أعمال مبنية عليه، أو استخدام اسمنا أو شعارنا، دون إذن كتابي مسبق منا.',
            'ولا يمنحك الاطلاع على أي تصميم في الموقع أي حق في تنفيذه أو إعادة إنتاجه أو تعديله.',
          ],
        },
        {
          id: 'portfolio',
          title: 'معرض الأعمال وصور المشاريع',
          body: [
            'قد تتضمن المشاريع المعروضة في الموقع أعمالاً منفّذة إلى جانب تصاميم مفاهيمية وصور مُنشأة حاسوبياً. والصور لأغراض توضيحية فقط؛ إذ قد تختلف التشطيبات والمواد والألوان والأثاث وتنسيق الحدائق في المشروع المنفّذ، ولا تُعدّ الصور عرضاً بتقديم نتيجة مطابقة.',
          ],
        },
        {
          id: 'third-parties',
          title: 'خدمات وروابط الأطراف الثالثة',
          body: [
            'يتضمن الموقع روابط إلى خدمات تقدمها أطراف ثالثة أو يحتوي عليها، مثل إنستغرام وفيسبوك وخرائط Google. ولا نتحكم في هذه الخدمات، وهي تخضع لشروطها وسياسات الخصوصية الخاصة بها. ولسنا مسؤولين عن محتواها أو توفرها أو ممارساتها، ولا يعني وجود رابط إليها أننا نؤيدها.',
          ],
        },
        {
          id: 'disclaimer',
          title: 'إخلاء المسؤولية',
          body: [
            'نحرص على أن يكون الموقع دقيقاً ومتاحاً وآمناً، إلا أنه يُقدَّم «كما هو» و«حسب توفره». وإلى أقصى حد يسمح به القانون، لا نضمن أن يعمل الموقع دون انقطاع أو أخطاء أو أن يخلو من المكونات الضارة، أو أن يكون محتواه كاملاً أو محدّثاً.',
            'المحتوى المنشور في الموقع معلومات عامة عن أعمالنا، ولا يُعدّ استشارة مهنية لموقعك أو مشروعك تحديداً، إذ يتطلب ذلك دائماً تقييماً متخصصاً، ولا ينبغي الاعتماد عليه بهذه الصفة.',
          ],
        },
        {
          id: 'liability',
          title: 'حدود المسؤولية',
          body: [
            'إلى أقصى حد يسمح به القانون المعمول به، لن تكون سما فورم مسؤولة عن أي خسائر غير مباشرة أو عرضية أو خاصة أو تبعية، أو عن أي خسارة في الأرباح أو الإيرادات أو البيانات أو الفرص التجارية، تنشأ عن استخدامك للموقع أو عدم قدرتك على استخدامه.',
            'وتخضع مسؤوليتنا عن الخدمات التي نقدمها بموجب اتفاقية مشروع لأحكام تلك الاتفاقية. ولا يحدّ أي شيء في هذه الشروط من أي مسؤولية لا يجوز قانوناً تحديدها أو استبعادها، ولا يستبعدها.',
          ],
        },
        {
          id: 'indemnity',
          title: 'مسؤوليتك',
          body: [
            'توافق على تعويض سما فورم عن أي مطالبات أو خسائر أو تكاليف (بما فيها أتعاب المحاماة المعقولة) تنشأ عن مخالفتك لهذه الشروط، أو عن محتواك، أو عن إساءة استخدامك للموقع.',
          ],
        },
        {
          id: 'changes',
          title: 'التغييرات على الموقع وعلى هذه الشروط',
          body: [
            'يحق لنا تحديث أي جزء من الموقع أو تغييره أو إيقافه في أي وقت. كما قد نحدّث هذه الشروط من حين لآخر، كأن يكون ذلك لمواكبة تغييرات في خدماتنا أو في القانون. ويوضح تاريخ «آخر تحديث» في أعلى هذه الصفحة موعد آخر تعديل عليها.',
            'تسري التغييرات فور نشرها على هذه الصفحة، ويُعدّ استمرارك في استخدام الموقع بعد ذلك قبولاً منك للشروط المحدّثة.',
          ],
        },
        {
          id: 'law',
          title: 'القانون الحاكم وتسوية النزاعات',
          body: [
            'تخضع هذه الشروط لقوانين الجمهورية اليمنية. وفي حال نشوء أي نزاع، نشجعك على التواصل معنا أولاً لمحاولة حله ودياً. ويخضع أي نزاع يتعذر حله بهذه الطريقة لاختصاص المحاكم المختصة في مدينة صنعاء.',
          ],
        },
        {
          id: 'general',
          title: 'أحكام عامة',
          body: [
            {
              list: [
                'تتوفر هذه الشروط باللغتين العربية والإنجليزية، وفي حال وجود أي تعارض بين النسختين، تُعتمد النسخة العربية.',
                'إذا تبيّن أن أي جزء من هذه الشروط باطل أو غير قابل للتنفيذ، تظل بقية الأحكام سارية بالكامل.',
                'لا يُعدّ عدم تطبيقنا لأي من هذه الشروط فوراً تنازلاً عن حقنا في تطبيقه لاحقاً.',
                'تشكّل هذه الشروط، إلى جانب سياسة الخصوصية، الاتفاقَ الكامل بينك وبين سما فورم بشأن استخدامك للموقع.',
              ],
            },
          ],
        },
        {
          id: 'contact',
          title: 'تواصل معنا',
          body: [
            'إذا كانت لديك أي أسئلة حول هذه الشروط، يُرجى التواصل معنا عبر البيانات أدناه.',
          ],
        },
      ],
    },

    privacy: {
      intro: [
        'خصوصيتك تهمّنا. توضح سياسة الخصوصية هذه المعلومات الشخصية التي تجمعها سما فورم عند استخدامك لموقعنا وتواصلك معنا، وأسباب جمعها، وكيفية استخدامها ومشاركتها وحمايتها، والخيارات والحقوق المتاحة لك.',
        'تنطبق هذه السياسة على موقع سما فورم الإلكتروني، بما في ذلك نموذج «ابدأ مشروعك» (ويُشار إليهما مجتمعَين بـ«الموقع»)، وعلى مراسلاتك معنا بشأن أي مشروع محتمل. وباستخدامك للموقع، فإنك تقرّ بأنك قرأت هذه السياسة.',
      ],
      sections: [
        {
          id: 'who-we-are',
          title: 'الجهة المسؤولة عن معلوماتك',
          body: [
            'سما فورم، وهو استوديو للتصميم المعماري والداخلي يقع في الدور السادس، برج الشلال، شارع الأصبحي، صنعاء، الجمهورية اليمنية، هو الجهة المسؤولة عن المعلومات الشخصية الموضحة في هذه السياسة («سما فورم» أو «نحن» أو ضمير المتكلم).',
          ],
        },
        {
          id: 'information-we-collect',
          title: 'المعلومات التي نجمعها',
          body: [
            'المعلومات التي تقدمها لنا عبر نموذج «ابدأ مشروعك»:',
            {
              list: [
                'بيانات الاتصال: اسمك الكامل ورقم هاتفك ومدينتك، وبريدك الإلكتروني إذا اخترت تقديمه.',
                'تفاصيل المشروع: نوع المساحة (مثل شقة أو فيلا أو محل تجاري أو مطعم أو مكتب أو صالون)، ونطاق الميزانية أو قيمتها، والمساحة، والجدول الزمني، وأسلوب التصميم والطراز المعماري، والأولويات، وعدد الغرف والطوابق، وأي إجابات أخرى تختارها.',
                'أوصافك: كل ما تكتبه في الحقول النصية عن رؤيتك أو متطلباتك أو تفضيلاتك.',
                'الصور: صور الإلهام وصور مساحتك الحالية التي تختار رفعها.',
                'تاريخ تقديم طلبك ووقته.',
              ],
            },
            'المعلومات التي تقدمها لنا بطرق أخرى: عندما تراسلنا عبر البريد الإلكتروني أو تتصل بنا أو تراسلنا عبر وسائل التواصل الاجتماعي أو تلتقي بنا، نحتفظ بالمعلومات التي تشاركها، مثل اسمك وبيانات اتصالك ومحتوى رسائلك.',
            'المعلومات التي تُجمع تلقائياً: كما هو الحال في معظم المواقع، تسجّل الخوادم التي تستضيف الموقع تلقائياً بعض المعلومات التقنية عند زيارتك، مثل عنوان IP الخاص بك ونوع المتصفح والجهاز والصفحات التي تطلبها وتاريخ الزيارة ووقتها. وتُستخدم هذه المعلومات لتشغيل الموقع والحفاظ على أمنه ومعالجة الأعطال.',
            'لا نستخدم في الموقع أي أدوات للتحليلات أو الإعلانات أو التتبع، ولا ننشئ ملفات تعريفية للزوار.',
          ],
        },
        {
          id: 'sensitive-information',
          title: 'معلومات لا نطلبها',
          body: [
            'لا نحتاج إلى معلومات حساسة، ونطلب منك عدم إرسالها إلينا، مثل وثائق الهوية أو بيانات الحسابات المصرفية أو البطاقات أو المعلومات الصحية أو المعلومات المتعلقة بالمعتقدات الدينية أو السياسية. كما يُرجى التأكد من أن الصور التي ترفعها لا تُظهر أشخاصاً لم يوافقوا على مشاركة صورهم، أو مستندات خاصة.',
          ],
        },
        {
          id: 'how-we-use',
          title: 'كيف نستخدم معلوماتك',
          body: [
            'نستخدم معلوماتك للأغراض التالية فقط:',
            {
              list: [
                'دراسة طلبك وفهم مشروعك ومساحتك ومتطلباتك؛',
                'التواصل معك بشأن طلبك والإجابة عن أسئلتك وترتيب الاجتماعات أو الزيارات الميدانية؛',
                'إعداد التقديرات الأولية والعروض وعروض الأسعار والتصاميم؛',
                'تنفيذ مشروعك وإدارته في حال اتفقنا على العمل معاً؛',
                'الاحتفاظ بسجلات داخلية للطلبات التي نتلقاها، وتحسين خدماتنا والموقع؛',
                'حماية الموقع وعملائنا وأعمالنا من الاحتيال وإساءة الاستخدام والتهديدات الأمنية؛',
                'الامتثال لالتزاماتنا القانونية، وإثبات المطالبات القانونية أو الدفاع عنها.',
              ],
            },
            'لن نرسل إليك رسائل تسويقية ما لم تطلب ذلك، ويمكنك أن تطلب منا التوقف عن إرسالها في أي وقت. كما أننا لا نتخذ أي قرارات بشأنك عبر معالجة آلية بالكامل.',
          ],
        },
        {
          id: 'legal-basis',
          title: 'الأساس الذي نستند إليه في استخدام معلوماتك',
          body: [
            'نستخدم معلوماتك الشخصية للأسباب التالية:',
            {
              list: [
                'لأنك طلبت منا ذلك بتقديمك طلباً أو تواصلك معنا (وحيثما نعتمد على موافقتك، يمكنك سحبها في أي وقت)؛',
                'لأنها لازمة لاتخاذ خطوات طلبتها قبل إبرام عقد، أو لتنفيذ عقد معك؛',
                'لأن لنا مصلحة مشروعة في إدارة أعمالنا والموقع وتأمينهما وتحسينهما، بما لا يتعارض مع حقوقك؛',
                'لأن القانون يُلزمنا بذلك.',
              ],
            },
          ],
        },
        {
          id: 'cookies',
          title: 'ملفات تعريف الارتباط والتقنيات المشابهة',
          body: [
            'لا يضع الموقع نفسه ملفات تعريف ارتباط للإعلانات أو التحليلات. ولا يُحفظ اختيارك للغة، إذ يعود إلى الوضع الافتراضي عند مغادرتك. أما منطقة الإدارة، التي يستخدمها فريق سما فورم فقط، فتحتفظ بجلسة تسجيل الدخول في التخزين المحلي للمتصفح.',
            'تعتمد بعض الميزات على خدمات أطراف ثالثة قد تتلقى عنوان IP الخاص بك أو تضع ملفات تعريف ارتباط خاصة بها:',
            {
              list: [
                'خطوط Google: يُقدَّم الخط المستخدم في الموقع عبر Google، التي تتلقى عنوان IP الخاص بك لإرسال الخط إلى متصفحك.',
                'خرائط Google: تقدّم Google الخريطة المعروضة في صفحة «اتصل بنا»، وقد تضع ملفات تعريف ارتباط وتجمع معلومات وفقاً لسياسة الخصوصية الخاصة بها.',
              ],
            },
            'يمكنك التحكم في ملفات تعريف الارتباط أو حذفها من خلال إعدادات متصفحك، علماً بأن حظرها قد يؤثر في عمل الخريطة المضمّنة.',
          ],
        },
        {
          id: 'sharing',
          title: 'كيف نشارك معلوماتك',
          body: [
            'لا نبيع معلوماتك الشخصية ولا نؤجّرها ولا نتاجر بها. ولا نشاركها إلا عند الضرورة، ومع الجهات التالية فقط:',
            {
              list: [
                'أعضاء فريق سما فورم الذين يحتاجون إليها للتعامل مع طلبك أو مشروعك؛',
                'مزوّدي الخدمات الذين يساعدوننا في إدارة أعمالنا، مثل مزوّدي استضافة المواقع والبريد الإلكتروني وتقنية المعلومات، والذين لا يحق لهم استخدامها إلا لتقديم خدماتهم لنا؛',
                'المهندسين أو الاستشاريين أو المقاولين أو الموردين المشاركين في مشروعك، وذلك بموافقتك فقط وفي حدود ما يحتاجون إليه؛',
                'المستشارين المهنيين، كالمحامين والمحاسبين، عند الضرورة المعقولة؛',
                'الجهات الحكومية أو المحاكم أو الجهات التنظيمية، عندما يُلزمنا القانون بذلك أو لحماية حقوقنا أو حقوق عملائنا أو الجمهور؛',
                'أي جهة تخلفنا أو تستحوذ على أعمالنا، في حال إعادة هيكلة أعمالنا أو دمجها أو بيعها كلياً أو جزئياً، مع التزامها بهذه السياسة.',
              ],
            },
          ],
        },
        {
          id: 'transfers',
          title: 'أين تُخزَّن معلوماتك',
          body: [
            'تُخزَّن معلوماتك على الخوادم التي تستضيف الموقع وفي الأنظمة التي نستخدمها للتواصل معك. وقد يقوم بعض هؤلاء المزوّدين، وخدمات الأطراف الثالثة مثل Google، بتخزين المعلومات أو معالجتها خارج الجمهورية اليمنية. وفي هذه الحالة، نتخذ خطوات معقولة لضمان بقاء معلوماتك محمية بما يتوافق مع هذه السياسة.',
          ],
        },
        {
          id: 'retention',
          title: 'مدة احتفاظنا بمعلوماتك',
          body: [
            'نحتفظ بالمعلومات الشخصية فقط طوال المدة التي نحتاج إليها لتحقيق الأغراض الموضحة في هذه السياسة:',
            {
              list: [
                'الطلبات التي لا تتحول إلى مشروع نحتفظ بها طوال المدة اللازمة للرد عليك ومتابعتك، ثم نحذفها أو نُخفي هويتها بحيث لا تعود تدل عليك.',
                'إذا عملنا معاً، نحتفظ بسجلات المشروع طوال مدة تنفيذه، ولمدة بعد ذلك وفق ما يقتضيه القانون أو التزاماتنا المهنية أو التعامل مع أي مطالبات.',
                'يمكنك أن تطلب منا حذف معلوماتك قبل ذلك في أي وقت (انظر قسم «حقوقك» أدناه).',
              ],
            },
          ],
        },
        {
          id: 'security',
          title: 'كيف نحمي معلوماتك',
          body: [
            'نطبّق تدابير تقنية وتنظيمية مناسبة لحماية معلوماتك من الفقدان وإساءة الاستخدام والوصول غير المصرح به، ومن ذلك قصر الاطلاع على الطلبات المقدَّمة على الموظفين المخوَّلين عبر منطقة إدارة محمية بكلمة مرور، وعدم قبول أي ملفات غير الصور الحقيقية عبر نماذج الرفع.',
            'لا توجد وسيلة لنقل المعلومات أو تخزينها عبر الإنترنت آمنة تماماً، لذا لا يمكننا ضمان الأمان المطلق. وفي حال علمنا بحادث أمني يمسّ معلوماتك، سنتخذ خطوات فورية لمعالجته وسنُبلغك بذلك متى كان ذلك مطلوباً.',
          ],
        },
        {
          id: 'your-rights',
          title: 'حقوقك',
          body: [
            'مع مراعاة القانون المعمول به، يحق لك:',
            {
              list: [
                'الاستفسار عمّا إذا كنا نحتفظ بمعلومات عنك والحصول على نسخة منها؛',
                'طلب تصحيح المعلومات غير الدقيقة أو غير المكتملة؛',
                'طلب حذف معلوماتك؛',
                'الاعتراض على طريقة استخدامنا لمعلوماتك أو طلب تقييدها؛',
                'سحب موافقتك في أي وقت، حيثما نعتمد عليها؛',
                'طلب تزويدك بمعلوماتك بصيغة شائعة الاستخدام.',
              ],
            },
            'لتقديم أي طلب، تواصل معنا عبر البيانات أدناه. وقد نحتاج إلى التحقق من هويتك قبل الرد. وسنرد خلال مدة معقولة، وعادةً في غضون ٣٠ يوماً. وإذا تعذّر علينا تلبية طلبك بالكامل، كأن يُلزمنا القانون بالاحتفاظ ببعض السجلات، فسنوضح لك السبب.',
          ],
        },
        {
          id: 'children',
          title: 'الأطفال',
          body: [
            'الموقع موجّه للبالغين، ولا نجمع عن قصد أي معلومات شخصية من أي شخص يقل عمره عن ١٨ عاماً. وإذا كنت تعتقد أن طفلاً أرسل إلينا معلوماته، يُرجى التواصل معنا وسنقوم بحذفها.',
          ],
        },
        {
          id: 'external-links',
          title: 'المواقع الأخرى',
          body: [
            'يحتوي الموقع على روابط إلى مواقع وخدمات أخرى، مثل صفحاتنا على إنستغرام وفيسبوك وخرائط Google، ولا تنطبق هذه السياسة عليها. ونوصيك بقراءة سياسات الخصوصية الخاصة بها قبل مشاركة أي معلومات معها.',
          ],
        },
        {
          id: 'changes',
          title: 'التغييرات على هذه السياسة',
          body: [
            'قد نحدّث سياسة الخصوصية هذه من حين لآخر، كأن نغيّر طريقة تعاملنا مع المعلومات أو نضيف ميزات جديدة إلى الموقع. ويوضح تاريخ «آخر تحديث» في أعلى هذه الصفحة موعد آخر تعديل عليها. وفي حال إجراء تغييرات جوهرية، سنوضح ذلك بجلاء في الموقع.',
          ],
        },
        {
          id: 'contact',
          title: 'تواصل معنا',
          body: [
            'إذا كانت لديك أي أسئلة حول هذه السياسة أو طريقة تعاملنا مع معلوماتك، أو كنت ترغب في ممارسة حقوقك، يُرجى التواصل معنا عبر البيانات أدناه.',
          ],
        },
      ],
    },
  },
};
