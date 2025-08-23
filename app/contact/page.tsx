"use client";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          topic: "",
          company: "",
          message: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Form submission error:", errorData);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Network error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const topicOptions = [
    { value: "", label: "Select a topic" },
    { value: "design-brief", label: "Design Brief & Consultation" },
    { value: "brand-audit", label: "Brand Audit & Strategy" },
    { value: "mep-quote", label: "MEP Services Quote" },
    { value: "rfp", label: "Request for Proposal" },
    { value: "partnership", label: "Partnership Opportunity" },
    { value: "general", label: "General Inquiry" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-8 py-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            Get in Touch
          </div>
          <h1 className="font-heading text-4xl md:text-6xl leading-tight tracking-tight mb-6">
            Let&apos;s discuss your project
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Whether you need interior design, F&B branding, or MEP services,
            we&apos;re here to help bring your vision to life.
          </p>
        </div>

        {/* Contact Form */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-surface text-text placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-surface text-text placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Topic of Interest *
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200"
                  >
                    {topicOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-surface text-text placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-text mb-2"
                >
                  Project Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-surface text-text placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 resize-none"
                  placeholder="Tell us about your project, timeline, budget, and any specific requirements..."
                />
              </div>

              {/* Submit Status Messages */}
              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800">
                  <p className="font-medium">Thank you for your message!</p>
                  <p className="text-sm">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800">
                  <p className="font-medium">Something went wrong.</p>
                  <p className="text-sm">
                    Please try again or email us directly at hello@cmon.group
                  </p>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-accent hover:text-text transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="bg-surface rounded-3xl p-8 shadow-soft ring-1 ring-black/5">
            <h3 className="font-heading text-2xl mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted mb-1">Email</p>
                <a
                  href="mailto:hello@cmon.group"
                  className="text-text hover:text-accent transition-colors duration-200"
                >
                  hello@cmon.group
                </a>
              </div>
              <div>
                <p className="text-sm text-muted mb-1">Phone</p>
                <a
                  href="tel:+96100000000"
                  className="text-text hover:text-accent transition-colors duration-200"
                >
                  +961 00 000 000
                </a>
              </div>
              <div>
                <p className="text-sm text-muted mb-1">Location</p>
                <p className="text-text">Beirut, Lebanon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
