import React from "react";
import { Scroll } from "lucide-react";
import "./tos-view.scss";

const TermsOfUse = () => {
  return (
    <div className="tos__container">
      <div className="tos__header">
        <Scroll className="tos__header-icon" />
        <h1 className="tos__header-title">Terms of Use</h1>
      </div>

      <div className="tos__content">
        <section className="tos__content-section">
          <h2 className="tos__content-title">1. Acceptance of Terms</h2>
          <p className="tos__content-text">
            By accessing and using myFlix, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Use. If you do
            not agree to these terms, please refrain from using the service.
          </p>
        </section>

        <section className="tos__content-section">
          <h2 className="tos__content-title">2. User Account</h2>
          <p className="tos__content-text">
            To access certain features of myFlix, you must create an account.
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account.
          </p>
        </section>

        <section className="tos__content-section">
          <h2 className="tos__content-title">3. Content Usage</h2>
          <p className="tos__content-text">
            The content provided through myFlix is for personal, non-commercial
            use only. You may not modify, distribute, transmit, display,
            perform, reproduce, publish, license, create derivative works from,
            transfer, or sell any information obtained from myFlix.
          </p>
        </section>

        <section className="tos__content-section">
          <h2 className="tos__content-title">4. Privacy</h2>
          <p className="tos__content-text">
            Your privacy is important to us. Our use of your personal
            information is governed by our Privacy Policy. By using myFlix, you
            consent to our collection and use of personal information as
            outlined in the Privacy Policy.
          </p>
        </section>

        <section className="tos__content-section">
          <h2 className="tos__content-title">5. Modifications</h2>
          <p className="tos__content-text">
            We reserve the right to modify these Terms of Use at any time.
            Continued use of myFlix after any such changes constitutes your
            acceptance of the new Terms of Use.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfUse;
