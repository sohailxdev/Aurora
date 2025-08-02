import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const privacyItems = [
  {
    title: "Description of Services",
    content: [
      {
        category: "General.",
        content:
          "This Agreement sets forth the terms and conditions that apply to the use of the Site by the User. By using this Site, the User agrees to comply with all of the TERMS AND CONDITIONS hereof. The right to use the Site is personal to the User and is not transferable to any other person or entity. The User shall be responsible for protecting the confidentiality of their password(s), if any. The User acknowledges that, although the internet is often a secure environment, sometimes there are interruptions in service or events that are beyond the control of the Company, and the Company shall not be responsible for any data lost while transmitting information on the internet. While it is the Company's objective to make the Site accessible 24 hours per day, 7 days per week, the Site may be unavailable from time to time for any reason including, without limitation, routine maintenance. You understand and acknowledge that due to circumstances both within and outside of the control of the Company, access to the Site may be interrupted, suspended or terminated from time to time. The Company shall have the right at any time to change or discontinue any aspect or feature of the Site, including, but not limited to, content, hours of availability and equipment needed for access or use. Further, the Company may discontinue disseminating any portion of information or category of information may change or eliminate any transmission method and may change transmission speeds or other signal characteristics.",
      },
      {
        category: "Membership Eligibility.",
        content:
          "Use of the Site is available only to persons who can form legally binding contracts under Indian Contract Act, 1872. Persons who are `incompetent to contract` within the meaning of the Indian Contract Act, 1872 including minors, un-discharged insolvents etc. are not eligible to use the Site. If you are a minor i.e. under the age of 18 years, you shall not register as a member of the Site and shall not sell, purchase or bid for any items on the Site. As a minor if you wish to purchase or sell an item on the Site such purchase or sale may be made by your legal guardian or parents who have registered as users of the Site. We reserve the right to terminate your membership and refuse to provide you with access to the Site if it is brought to our notice or if it is discovered that you are under the age of 18 years.",
      },
      {
        category: "Your Account.",
        content:
          "In consideration of your use of the Site, you represent that you are of legal age to form a binding contract and are not a person barred from receiving services under the laws as applicable in India. You also agree to provide true, accurate, current and complete information about yourself as prompted by the Site's registration form. If you provide any information that is untrue, inaccurate, not current or incomplete (or becomes untrue, inaccurate, not current or incomplete), or We have reasonable grounds to suspect that such information is untrue, inaccurate, not current or incomplete, We have the right to suspend or terminate your account and refuse any and all current or future use of the Site (or any portion thereof). If you use the Site, you are responsible for maintaining the confidentiality of your account and password including cases when it is being used by any of your family members, friends or relatives, whether a minor or an adult. You further agree to accept responsibility for all transactions made from your account and any dispute arising out of any misuse of your account, whether by any family member, friend, relative, any third party or otherwise shall not be entertained by the Company. Because of this, we strongly recommend that you exit from your account at the end of each session. You agree to notify us immediately of any unauthorized use of your account or any other breach of security. We reserve the right to refuse service, terminate accounts, or remove or edit content in our sole discretion.",
      },
      {
        category: "Your Information (or any items listed):",
        content:
          "`Your Information` is defined as any information you provide to us or other users of the Site in the registration process, in the feedback area, bulletin board, chat service etc. or through any e-mail feature. You are solely responsible for Your Information, and in accordance with certain features of the Site we may only act as a passive conduit for your online distribution and publication of Your Information.",
      },
    ],
  },
  {
    title: "License and Site Access",
    content: [
      {
        category: "",
        content:
          "We grant you a limited license to access and make personal use of the Site and the Service. This license does not include any downloading or copying of account information for the benefit of another vendor or any other third party; caching, unauthorized hypertext links to the Site and the framing of any Content available through the Site uploading, posting, or transmitting any content that you do not have a right to make available (such as the intellectual property of another party); uploading, posting, or transmitting any material that contains software viruses or any other computer code, files or programs designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment; any action that imposes or may impose (in our sole discretion) an unreasonable or disproportionately large load on our infrastructure; or any use of data mining, robots, or similar data gathering and extraction tools. You may not bypass any measures used by us to prevent or restrict access to the Site. Any unauthorized use by you shall terminate the permission or license granted to you by us.",
      },
      {
        category: "Links",
        content:
          "The Site or third parties may provide links to other World Wide Web sites or resources. Because we have no control over such Sites and resources, you acknowledge and agree that we are not responsible for the availability of such external sites or resources, and do not endorse and are not responsible or liable for any content, advertising, products or other materials on or available from such sites or resources. You further acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such site or resource.",
      },
      {
        category: "Pricing Information in case of sale by us",
        content:
          "We strive to provide you with the best prices possible on products and/or services you buy from us, however, We do not guarantee that the price will be the lowest in the city, region or geography. Prices and availability are subject to change without any prior notice. The prices mentioned on the Site are not subject to comparison with the same or similar product(s) and/or service(s) available through any online or offline sale. The pricing is subject to our pricing policy and the prices shall be determined only at our sole discretion.",
      },
      {
        category: "Cancellation by Us",
        content:
          "Please note that there may be certain orders that we are unable to accept and must cancel. We reserve the right, at our sole discretion, to refuse or cancel any order for any reason. Some situations that may result in your order being cancelled shall include limitations on quantities available for purchase, inaccuracies or errors in product or pricing information, or any defect regarding the quality of the product. We may also require additional verifications or information before accepting any order. We will contact you if all or any portion of your order is cancelled or if additional information is required to accept your order. If your order is cancelled after your credit card has been charged, the said amount will be reversed back in your Card Account.",
      },
    ],
  },
  {
    title: "Use of Your Information",
    content: [
      {
        category: "",
        content:
          "Please note that there may be certain orders that we are unable to accept and must cancel. We reserve the right, at our sole discretion, to refuse or cancel any order for any reason. Some situations that may result in your order being cancelled shall include limitations on quantities available for purchase, inaccuracies or errors in product or pricing information, or any defect regarding the quality of the product. We may also require additional verifications or information before accepting any order. We will contact you if all or any portion of your order is cancelled or if additional information is required to accept your order. If your order is cancelled after your credit card has been charged, the said amount will be reversed back in your Card Account.",
      },
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      {
        category: "Indemnity",
        content:
          "You shall to the fullest extent indemnify and hold harmless the Company, its subsidiaries and affiliates, and their respective officers, directors, shareholders, agents, and employees, from any claim or demand, or actions including reasonable attorneys' fees, made by any third party or penalty imposed due to or arising out of your breach of this Agreement, or the documents it incorporates by reference, or your violation of any law, rules or regulations or the rights of a third party.",
      },
    ],
  },
];

function TermsAndCondition() {
  return (
    <div className="max-w-7xl mx-auto   px-4 py-12 text-[#6d6d6d] font-custom font-extralight">
      <div className="text-left space-y-10">
        <div className="text-left font-opensans text-sm text-muted-foreground space-y-3 text-[10px]">
          <p>
            You (“you” or “End User” or “your” or “Buyer” or “Customer”) are
            required to read and accept all of the terms and conditions laid
            down in this Terms and Conditions (“Terms and Conditions” or “TERMS
            AND CONDITIONS” or “Terms” or “Agreement”) and the linked Privacy
            Policy, before you may use www.houseofvalor.in (hereinafter referred
            to as “Site” or “Impulse International Pvt Ltd.” or “we” or “our”).
            The Site allows you to browse, select and purchase Clothing (“Goods”
            or “Products” or “Services”).
          </p>

          <p>
            The Company may amend this Agreement and/or the Privacy Policy at
            any time by posting a revised version on the Site. All updates and
            amendments shall be notified to you via posts on website or through
            e-mail. The revised version will be effective at the time we post it
            on the Site, and in the event you continue to use our Site, you are
            impliedly agreeing to the revised TERMS AND CONDITIONS and Privacy
            Policy expressed herein.
          </p>
          <p>
            In addition, if the revised version of this Agreement includes a
            Substantial Change, we will provide you with 30 days’ prior notice
            of such Substantial Change as per the Notification Preferences
            provided by you. You are advised to regularly check for any
            amendments or updates to the terms and conditions contained in this
            Agreement. For the purpose of this Agreement, the term “Substantial
            Change” means a change to the terms of this Agreement that
            materially reduces your rights or increases your responsibilities.
          </p>
          <p>
            Please read these terms and conditions carefully. These terms &
            conditions, as modified or amended from time to time, are a binding
            contract between the company and you. If you visit, use, or shop at
            the site (or any future site operated by the company, you accept
            these terms and conditions). In addition, when you use any current
            or future services of the company or visit or purchase from any
            business affiliated with the company or third party vendors, whether
            or not included in the site, you will also be subject to the
            guidelines and conditions applicable to such service or merchant. If
            these conditions are inconsistent with such guidelines and
            conditions, such guidelines and conditions will prevail.
          </p>
          <p>
            Please ensure that you read the Privacy Policy of such other
            companies or organizations before submitting your details.
          </p>
          <p>
            This Privacy Policy describes the information, as part of the normal
            operation of our services, we collect from you and what may happen
            to that information. This policy is inter alia formulated and
            displayed to inform you about our information collection/retention
            policies and practices so that you can make an informed decision in
            relation to the sharing of your personal information with us.
          </p>
          <p>
            {" "}
            If this Terms and Conditions conflicts with any other document, the
            Terms and Conditions will prevail for the purposes of usage of the
            Site. As a condition of purchase, the Site requires your permission
            to send you administrative and promotional emails. We will send you
            information regarding your account activity and purchases, as well
            as updates about our products and promotional offers. You can opt
            out of our promotional emails anytime by clicking the UNSUBSCRIBE
            link at the bottom of any of our email correspondences.
          </p>
          <p>
            Please see our Privacy Policy for details. We shall have no
            responsibility in any manner whatsoever regarding any promotional
            emails or SMS sent to you. The offers made in those promotional
            emails or SMS shall be subject to change at the sole discretion
            of the Company and the Company owes no responsibility to provide you
            any information regarding such change. By placing an order, you make
            an offer to us to purchase products you have selected based on
            standard Site restrictions, Merchant specific restrictions, and on
            the terms and conditions stated below. You are required to create an
            account in order to purchase any product from the Site. This is
            required so we can provide you with easy access to print your orders
            and view your past purchases.
          </p>
          <p>
            The Site/Company takes no responsibility for the services or
            products that are sold or supplied by third party vendors. The
            Company makes no warranty to their end users for the quality,
            safety, usability, or other aspect of a product or service that is
            supplied by a Merchant and/for some services or activities that
            involve potential bodily harm, and for those activities, the Company
            takes no responsibility for the service or activity being offered,
            and the End User takes responsibility for his or her own actions in
            utilizing those services.
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4 border-t"
        >
          {privacyItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="last:border-b py-3"
            >
              <AccordionTrigger className="text-sm text-logoGreen font-bold hover:no-underline">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.content.map((subItem, subIndex) => (
                  <div key={subIndex} className="mb-3 space-y-3">
                    <h3 className="font-bold text-logoGreen font-custom">{subItem.category}</h3>
                    <p className="font-opensans">{subItem.content}</p>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default TermsAndCondition;
