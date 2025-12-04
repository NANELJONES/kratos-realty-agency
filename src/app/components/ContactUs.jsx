"use client";
import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from "@emailjs/browser";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMail, HiOutlinePhone, HiOutlineChat } from "react-icons/hi";
import Button from "./Button";

const ContactUs = () => {
  const form = useRef();
  const [contact, setContact] = useState({
    user_name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Contact Information
  const contactInfo = {
    email: "kratosrealtygh@gmail.com",
    phone: "+233 24 499 0190",
    whatsapp: "+233 24 499 0190",
  };

  const resetter = () => {
    setContact({ user_name: "", email: "", message: "" });
  };

  const successToast = () => {
    toast.success("Message Successfully Sent", {
      position: "top-center",
      autoClose: 2500,
      hideProgressBar: false,
      theme: "dark",
    });
  };

  const failedToast = (errorMessage = "Message Could Not Be Sent.") => {
    toast.error(errorMessage, {
      position: "top-center",
      autoClose: 2500,
      hideProgressBar: false,
      theme: "dark",
    });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await emailjs.sendForm(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_TEMPLATE_ID,
        form.current,
        process.env.NEXT_PUBLIC_P_KEY
      );
      console.log("Email sent successfully:", result);
      setIsLoading(false);
      successToast();
      resetter();
    } catch (error) {
      console.error("Email sending error:", error);
      setIsLoading(false);
      failedToast("Failed to send message. Try again later.");
    }
  };

  return (
    <div id="contactUs" className="h-auto bg-primary">
      {/* Toast Container (only one instance needed) */}
      <ToastContainer />

      <div className="relative layout md:p-20">
        {/* Background Image */}
        <div className=" hidden md:block md:absolute md:top-[10em] w-[40em] max-w-[400px] max-h-[500px] h-[60em] z-0">
          <Image
            alt="background"
            src="/brand/NEW CONTACT US.jpg"
            className="w-full h-full object-cover"
            fill={true}
          />
        </div>

        {/* Contact Form */}
        <form
          ref={form}
          onSubmit={sendEmail}
          className="relative z-10 border-t-8 w-full md:w-[80%] shadow-2xl bg-primary/20 backdrop-blur-sm p-10  max-w-[600px] mx-auto flex flex-col gap-[1em]"
        >
          <h2 className="text-white">Send Us A Message</h2>

          <div className="flex flex-col gap-2">
            <p className="font-light text-white">Name:</p>
            <input
              value={contact.user_name}
              onChange={(e) =>
                setContact({ ...contact, user_name: e.target.value })
              }
              name="user_name"
              className="bg-transparent border text-[0.8em] text-white p-2"
              placeholder="Please Enter Your Name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-light text-white">Email:</p>
            <input
              value={contact.email}
              onChange={(e) =>
                setContact({ ...contact, email: e.target.value })
              }
              name="email"
              type="email"
              className="bg-transparent border text-white p-2 text-[0.8em]"
              placeholder="Please Enter Your Email"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-white">Message:</p>
            <textarea
              value={contact.message}
              onChange={(e) =>
                setContact({ ...contact, message: e.target.value })
              }
              name="message"
              rows="5"
              className="bg-transparent border text-white p-2 text-[0.8em]"
              placeholder="Enter your message"
              required
            ></textarea>
          </div>

          <div className="w-2/3 lg:w-2/5 mx-auto">
            <Button
              variant="secondary"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "SEND MESSAGE"
              )}
            </Button>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-white/20">
            <h3 className="text-white text-lg font-semibold mb-2">Get In Touch</h3>
            
            <div className="flex flex-col gap-3">
              {/* Email */}
              <Link 
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 text-white hover:text-orange-400 transition-colors"
              >
                <HiOutlineMail className="w-5 h-5" />
                <p className="text-sm md:text-base">{contactInfo.email}</p>
              </Link>

              {/* Phone */}
              <Link 
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-white hover:text-orange-400 transition-colors"
              >
                <HiOutlinePhone className="w-5 h-5" />
                <p className="text-sm md:text-base">{contactInfo.phone}</p>
              </Link>

              {/* WhatsApp */}
              <Link 
                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white hover:text-orange-400 transition-colors"
              >
                <HiOutlineChat className="w-5 h-5" />
                <p className="text-sm md:text-base">WhatsApp: {contactInfo.whatsapp}</p>
              </Link>
            </div>

            {/* <Link href={`mailto:${contactInfo.email}?subject=Job Application&body=Please find my resume/CV attached.`}>
              <p className="text-white text-center text-sm mt-4 hover:text-orange-400 transition-colors">
                To Join Us, Send Your Resume/CV
              </p>
            </Link> */}
          </div>
        </form>
      </div>

      <div className="w-full bg-white h-[10px]"></div>
    </div>
  );
};

export default ContactUs;