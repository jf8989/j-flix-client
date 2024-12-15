import React, { useState } from "react";
import { Cookie } from "lucide-react";
import "./cookie-preferences.scss";

const CookiePreferences = () => {
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    advertising: false,
  });

  const handleToggle = (key) => {
    if (key === "necessary") return; // Necessary cookies can't be disabled
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    // Implementation for saving cookie preferences
    console.log("Saved preferences:", preferences);
  };

  return (
    <div className="cookie-pref__container">
      <div className="cookie-pref__header">
        <Cookie className="cookie-pref__header-icon" />
        <h1 className="cookie-pref__header-title">Cookie Preferences</h1>
      </div>

      <div className="cookie-pref__content">
        <section className="cookie-pref__content-section">
          <p className="cookie-pref__content-text">
            We use cookies and similar technologies to help personalize content,
            tailor and measure ads, and provide a better experience. By clicking
            'Accept All', you agree to this use.
          </p>
        </section>

        <section className="cookie-pref__content-section">
          <div className="cookie-pref__preference-item">
            <div className="cookie-pref__preference-header">
              <h2 className="cookie-pref__preference-title">
                Necessary Cookies
              </h2>
              <div className="cookie-pref__toggle cookie-pref__toggle--disabled">
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  readOnly
                  className="cookie-pref__toggle-input"
                />
                <span className="cookie-pref__toggle-slider"></span>
              </div>
            </div>
            <p className="cookie-pref__preference-description">
              These cookies are essential for the website to function and cannot
              be disabled.
            </p>
          </div>

          <div className="cookie-pref__preference-item">
            <div className="cookie-pref__preference-header">
              <h2 className="cookie-pref__preference-title">
                Functional Cookies
              </h2>
              <div className="cookie-pref__toggle">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={() => handleToggle("functional")}
                  className="cookie-pref__toggle-input"
                />
                <span className="cookie-pref__toggle-slider"></span>
              </div>
            </div>
            <p className="cookie-pref__preference-description">
              These cookies enable personalized features and functionality.
            </p>
          </div>

          <div className="cookie-pref__preference-item">
            <div className="cookie-pref__preference-header">
              <h2 className="cookie-pref__preference-title">
                Analytics Cookies
              </h2>
              <div className="cookie-pref__toggle">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => handleToggle("analytics")}
                  className="cookie-pref__toggle-input"
                />
                <span className="cookie-pref__toggle-slider"></span>
              </div>
            </div>
            <p className="cookie-pref__preference-description">
              These cookies help us understand how visitors interact with our
              website.
            </p>
          </div>

          <div className="cookie-pref__preference-item">
            <div className="cookie-pref__preference-header">
              <h2 className="cookie-pref__preference-title">
                Advertising Cookies
              </h2>
              <div className="cookie-pref__toggle">
                <input
                  type="checkbox"
                  checked={preferences.advertising}
                  onChange={() => handleToggle("advertising")}
                  className="cookie-pref__toggle-input"
                />
                <span className="cookie-pref__toggle-slider"></span>
              </div>
            </div>
            <p className="cookie-pref__preference-description">
              These cookies are used to deliver personalized advertisements.
            </p>
          </div>
        </section>

        <div className="cookie-pref__actions">
          <button
            className="cookie-pref__button cookie-pref__button--secondary"
            onClick={() =>
              setPreferences({
                necessary: true,
                functional: false,
                analytics: false,
                advertising: false,
              })
            }
          >
            Reject All
          </button>
          <button
            className="cookie-pref__button cookie-pref__button--primary"
            onClick={() =>
              setPreferences({
                necessary: true,
                functional: true,
                analytics: true,
                advertising: true,
              })
            }
          >
            Accept All
          </button>
          <button
            className="cookie-pref__button cookie-pref__button--save"
            onClick={handleSave}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferences;
