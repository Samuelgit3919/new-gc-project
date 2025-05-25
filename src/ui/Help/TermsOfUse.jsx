

import React from "react";
import {
    BookOpen,
    UserCircle,
    AlertTriangle,
    Scale,
    KeyRound,
    FileText,
    Shield,
    XCircle,
    Mail,
} from "lucide-react";
import Layout from "../../Layout"

// CalloutBox without TypeScript
const CalloutBox = ({ children, type = "info" }) => {
    const styles = {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        warning: "bg-amber-50 border-amber-200 text-amber-800",
        important: "bg-red-50 border-red-200 text-red-800",
    };

    const icons = {
        info: <BookOpen className="h-5 w-5" />,
        warning: <AlertTriangle className="h-5 w-5" />,
        important: <AlertTriangle className="h-5 w-5" />,
    };

    return (
        <div className={`${styles[type]} border rounded-lg p-4 my-4`}>
            <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">{icons[type]}</div>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
};

const TermsOfUse = () => {
    const sections = [
        {
            id: "introduction",
            title: "Introduction",
            icon: <BookOpen className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    <p>
                        Welcome to our platform. These Terms of Use govern your use of our website and services. By accessing or
                        using our services, you agree to be bound by these Terms.
                    </p>
                    <p>
                        Please read these Terms carefully before using our platform. If you do not agree with any part of these
                        Terms, you may not use our services.
                    </p>
                    <CalloutBox type="info">
                        <p>
                            These Terms constitute a legally binding agreement between you and our company. They may be updated from
                            time to time, and your continued use of our services after such changes constitutes your acceptance of the
                            revised Terms.
                        </p>
                    </CalloutBox>
                </div>
            ),
        },
        {
            id: "responsibilities",
            title: "User Responsibilities",
            icon: <UserCircle className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    <p>As a user of our platform, you are responsible for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Providing accurate and complete information when creating an account</li>
                        <li>Maintaining the confidentiality of your account credentials</li>
                        <li>All activities that occur under your account</li>
                        <li>Ensuring that your use of our services complies with all applicable laws and regulations</li>
                        <li>Using our services in a manner that does not infringe on the rights of others</li>
                    </ul>
                    <CalloutBox type="warning">
                        <h4 className="font-semibold mb-2">What you can and can't do</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium">You can:</p>
                                <ul className="list-disc pl-6">
                                    <li>Use our services for personal or business purposes</li>
                                    <li>Share content that you have the right to share</li>
                                    <li>Provide feedback and suggestions for improvement</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-medium">You cannot:</p>
                                <ul className="list-disc pl-6">
                                    <li>Use our services for illegal activities</li>
                                    <li>Share harmful or offensive content</li>
                                    <li>Attempt to gain unauthorized access to our systems</li>
                                    <li>Use automated methods to access or use our services</li>
                                </ul>
                            </div>
                        </div>
                    </CalloutBox>
                </div>
            ),
        },
        {
            id: "account",
            title: "Account Terms",
            icon: <KeyRound className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    <p>
                        To access certain features of our platform, you may need to create an account. When you create an account,
                        you agree to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Provide accurate, current, and complete information</li>
                        <li>Maintain and promptly update your account information</li>
                        <li>Keep your password secure and confidential</li>
                        <li>Notify us immediately of any unauthorized use of your account</li>
                    </ul>
                    <p>
                        We reserve the right to suspend or terminate your account if we suspect that the information you provide is
                        inaccurate, outdated, or incomplete, or if you violate these Terms.
                    </p>
                    <CalloutBox type="info">
                        <p>
                            You are solely responsible for maintaining the confidentiality of your account credentials and for all
                            activities that occur under your account. If you suspect any unauthorized use of your account, please
                            contact us immediately.
                        </p>
                    </CalloutBox>
                </div>
            ),
        },
        {
            id: "intellectual",
            title: "Intellectual Property",
            icon: <FileText className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    <p>
                        All content, features, and functionality of our platform, including but not limited to text, graphics,
                        logos, icons, images, audio clips, digital downloads, data compilations, and software, are owned by us, our
                        licensors, or other providers of such material and are protected by copyright, trademark, patent, trade
                        secret, and other intellectual property or proprietary rights laws.
                    </p>
                    <p>You may not:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            Reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish,
                            download, store, or transmit any of the material on our platform, except as permitted by these Terms
                        </li>
                        <li>
                            Delete or alter any copyright, trademark, or other proprietary rights notices from copies of materials
                            from our platform
                        </li>
                        <li>
                            Access or use for any commercial purposes any part of our platform or any services or materials available
                            through our platform
                        </li>
                    </ul>
                    <CalloutBox type="warning">
                        <p>
                            Any use of our platform or its content not expressly permitted by these Terms is a breach of these Terms
                            and may violate copyright, trademark, and other laws.
                        </p>
                    </CalloutBox>
                </div>
            ),
        },
        {
            id: "liability",
            title: "Limitations of Liability",
            icon: <Shield className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    <p>
                        To the fullest extent permitted by applicable law, in no event will we, our affiliates, or our licensors,
                        service providers, employees, agents, officers, or directors be liable for damages of any kind, under any
                        legal theory, arising out of or in connection with your use, or inability to use, our platform, any websites
                        linked to it, any content on our platform or such other websites, including any direct, indirect, special,
                        incidental, consequential, or punitive damages, including but not limited to, personal injury, pain and
                        suffering, emotional distress, loss of revenue, loss of profits, loss of business or anticipated savings,
                        loss of use, loss of goodwill, loss of data, and whether caused by tort (including negligence), breach of
                        contract, or otherwise, even if foreseeable.
                    </p>
                    <CalloutBox type="important">
                        <h4 className="font-semibold mb-2">Important Legal Disclaimer</h4>
                        <p>
                            The foregoing does not affect any liability which cannot be excluded or limited under applicable law. In
                            jurisdictions that do not allow the exclusion or limitation of liability for consequential or incidental
                            damages, our liability will be limited to the maximum extent permitted by law.
                        </p>
                    </CalloutBox>
                </div>
            ),
        },
        {
            id: "termination",
            title: "Termination",
            icon: <XCircle className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    <p>
                        We may terminate or suspend your account and bar access to our platform immediately, without prior notice or
                        liability, under our sole discretion, for any reason whatsoever and without limitation, including but not
                        limited to a breach of these Terms.
                    </p>
                    <p>
                        If you wish to terminate your account, you may simply discontinue using our platform, or notify us that you
                        wish to delete your account.
                    </p>
                    <p>
                        All provisions of these Terms which by their nature should survive termination shall survive termination,
                        including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of
                        liability.
                    </p>
                    <CalloutBox type="info">
                        <p>
                            Upon termination, your right to use our platform will immediately cease. If you wish to terminate your
                            account, you may simply discontinue using our platform or contact us to request account deletion.
                        </p>
                    </CalloutBox>
                </div>
            ),
        },
        {
            id: "governing",
            title: "Governing Law",
            icon: <Scale className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    <p>
                        These Terms and your use of our platform will be governed by and construed in accordance with the laws of
                        [Your Jurisdiction], without giving effect to any choice or conflict of law provision or rule.
                    </p>
                    <p>
                        Any legal suit, action, or proceeding arising out of, or related to, these Terms or our platform shall be
                        instituted exclusively in the courts of [Your Jurisdiction]. You waive any and all objections to the
                        exercise of jurisdiction over you by such courts and to venue in such courts.
                    </p>
                    <CalloutBox type="info">
                        <p>
                            By using our platform, you agree to submit to the personal and exclusive jurisdiction of the courts
                            located within [Your Jurisdiction] for the purpose of litigating all disputes.
                        </p>
                    </CalloutBox>
                </div>
            ),
        },
        {
            id: "contact",
            title: "Contact Information",
            icon: <Mail className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    <p>If you have any questions about these Terms, please contact us at:</p>
                    <div className="bg-muted p-4 rounded-lg">
                        <p className="font-medium">Company Name</p>
                        <p>123 Main Street</p>
                        <p>City, State ZIP</p>
                        <p>Email: support@company.com</p>
                        <p>Phone: (123) 456-7890</p>
                    </div>
                    <p>We strive to respond to all inquiries within 48 hours.</p>
                </div>
            ),
        },
    ];

    return (
        <Layout>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b shadow-sm">
                    <div className="container mx-auto px-4 py-6">
                        <h1 className="text-3xl font-bold text-center text-gray-900">Terms of Use</h1>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-5xl mx-auto space-y-6">
                        {sections.map((section) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                            >
                                <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-gray-800">
                                    {section.icon}
                                    {section.title}
                                </h2>
                                <div className="text-gray-700">{section.content}</div>
                            </section>
                        ))}

                        {/* Last Updated */}
                        <div className="text-center text-gray-500 text-sm py-6">
                            Last Updated:{" "}
                            {new Date().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </Layout>
    );
};

export default TermsOfUse;
