import { Link } from "react-router-dom";
import { IoIosMail, IoLogoWhatsapp } from "react-icons/io";

import insta from "@/assets/Images/instalogo.png";

export default function Footer() {
  return (
    <footer className="border-t-2">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 flex flex-col gap-5">
          <div>
            <h2 className="text-2xl font-custom text-logoGreen font-medium mb-2 text-center sm:text-start">
              Let's Connect
            </h2>

            <div className="flex justify-center items-center lg:justify-start space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61570861362347&mibextid=LQQJ4d"
                className="hover:scale-110 transition-all duration-300 "
                aria-label="Facebook"
                target="_blank"
              >
                {/* <Facebook className="h-5 w-5 text-blue-700" /> */}
                <img src="https://img.icons8.com/?size=100&id=118467&format=png&color=777047" className=" w-7 object-cover text-green-900" />
              </a>
              <a
                href="https://www.instagram.com/houseofvalorclothing?igsh=MWQwb3N6OWE5OHh6eQ=="
                className="hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
                target="_blank"
              >
                <img src="https://img.icons8.com/?size=100&id=dz63urxyxSdO&format=png&color=777047" className=" w-7 object-cover" />
              </a>
              {/* <a
                href="mailto:customercare@houseofvalor.in"
                className="hover:scale-110 transition-all duration-300"
                aria-label="Gmail"
                target="_blank"
              >
                <img src="/Gmail_Logo.svg" className=" w-7 object-cover" />
              </a> */}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center sm:items-start lg:justify-start space-x-4 sm:space-x-0">
            <h2 className=" font-custom text-logoGreen font-medium text-center sm:text-start">
              Contact Us
            </h2>
            <div className="">
              <a
                href="mailto:customercare@houseofvalor.in"
                className="hover:underline flex items-center gap-2 text-center text-logoGreen font-opensans sm:text-start"
                target="_blank"
              >
                {/* <IoIosMail className="text-blue-700" size={20}/>  */}
                 <img src="https://img.icons8.com/?size=100&id=YRRhCXfA0Vd0&format=png&color=777047" className=" w-7 object-cover" />
                
                customercare@houseofvalor.in
              </a>
            </div>
            <div className="">
              <a
                href="https://wa.me/+918850193637"
                className="hover:underline flex items-center gap-2 text-center text-logoGreen font-opensans sm:text-start"
                target="_blank"
              >
                {/* <IoLogoWhatsapp className="text-green-600" size={20} /> */}

                 <img src="https://img.icons8.com/?size=100&id=16733&format=png&color=777047  " className=" object-cover w-6" />

                {/* https://img.icons8.com/?size=100&id=16733&format=png&color=40C057 */}
                +91 88501 93637
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid w-full grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Links */}
          <div className="lg:col-span-1 font-opensans">
            <h3 className="text-sm font-custom font-medium mb-4 text-logoGreen">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/aboutus" className=" hover:underline">
                  About us
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1 font-opensans">
            <h3 className="text-sm font-custom font-medium mb-4 text-logoGreen">
              Quick Links
            </h3>
            <ul className="space-y-2 ">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-sm font-opensans hover:underline"
                >
                  Returns / Exchange
                </Link>
              </li>
              <li>
                <Link to="/T&C" className="text-sm hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  state={{ openAccordion: 0 }}
                  className="text-sm hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  state={{ openAccordion: 7 }}
                  className="text-sm hover:underline"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Copyright */}
      </div>
      <div className="h-20 bg-logoGreen text-white border-t flex items-center justify-center text-center text-sm">
  All Rights Reserved
  <span className="inline-flex items-baseline mr-0.5 ml-0.5">
            House of Valor
            <sup className="ml-0.5 text-[10px] align-top justify-start ">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full border border-white font-semibold">
                <span className="text-[6px] leading-none mt-0.5">™</span>
              </span>
            </sup>
          </span>
  © 2025
</div>

    </footer>
  );
}
