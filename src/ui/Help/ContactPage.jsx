

import { useState } from "react";
import { Clock, Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import Layout from "../../Layout"


export default function ContactPage() {
    const [chatOpen, setChatOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneType: "mobile",
        phone: "",
        department: "support",
        message: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here
        console.log("Form submitted:", formData);
    };

    const contactMethods = [
        {
            icon: Mail,
            title: "Send us an email",
            contact: "info@example.com",
            description: "address",
            href: "mailto:info@example.com"
        },
        {
            icon: Phone,
            title: "Contact our call center",
            contact: "+1 (234) 567-8901",
            description: "Available 24/7",
            href: "tel:+12345678901"
        },
        {
            icon: MessageSquare,
            title: "Reach us using our short code",
            contact: "991",
            description: "Text us anytime"
        }
    ];

    const businessHours = [
        { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST" },
        { day: "Saturday", hours: "10:00 AM - 4:00 PM EST" },
        { day: "Sunday", hours: "Closed" },
        { day: "Holidays", hours: "Limited Hours" }
    ];

    const responseTimes = [
        { type: "Email Inquiries", time: "Within 24 hours" },
        { type: "Phone Calls", time: "Immediate during business hours" },
        { type: "Contact Form", time: "Within 48 hours" },
        { type: "Urgent Support", time: "Priority response" }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                {/* Header Section */}
                <section className="py-12 px-4 md:px-8 lg:px-16">
                    <div className="container mx-auto max-w-6xl bg-[#0a1a35] text-white p-8 md:p-12 rounded-xl shadow-xl">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/2">
                                <div className="inline-block bg-gray-400/30 text-white px-4 py-2 rounded-md mb-6">
                                    Contact Us
                                </div>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                                    Contact us for comprehensive business solutions
                                </h2>

                                <div className="mt-8">
                                    <img
                                        src="/contact-support.webp"
                                        alt="Customer Support Representative"
                                        className="max-w-[250px] mx-auto"
                                        width={250}
                                        height={250}
                                        loading="lazy"
                                    />
                                    <p className="text-center text-sm mt-4 max-w-xs mx-auto">
                                        If you have questions leave us a message down here, someone from our team will get back to you shortly.
                                    </p>
                                </div>
                            </div>

                            <div className="md:w-2/5">
                                <Card className="bg-white text-black p-6 rounded-lg shadow-lg">
                                    <CardContent className="p-0">
                                        <h2 className="text-xl font-semibold text-center mb-6">Schedule a free consultation</h2>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="firstName">First Name</Label>
                                                    <Input
                                                        id="firstName"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        placeholder="First Name"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lastName">Last Name</Label>
                                                    <Input
                                                        id="lastName"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        placeholder="Last Name"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Email"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone</Label>
                                                <div className="flex">
                                                    <Select
                                                        name="phoneType"
                                                        value={formData.phoneType}
                                                        onValueChange={(value) => setFormData(prev => ({ ...prev, phoneType: value }))}
                                                    >
                                                        <SelectTrigger className="w-[100px]">
                                                            <SelectValue placeholder="Type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="mobile">Mobile</SelectItem>
                                                            <SelectItem value="work">Work</SelectItem>
                                                            <SelectItem value="home">Home</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Input
                                                        id="phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className="flex-1 ml-2"
                                                        placeholder="Phone Number"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="department">Department</Label>
                                                <Select
                                                    name="department"
                                                    value={formData.department}
                                                    onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="support">Customer Support</SelectItem>
                                                        <SelectItem value="sales">Sales</SelectItem>
                                                        <SelectItem value="technical">Technical Support</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">Message</Label>
                                                <Textarea
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="Message"
                                                    rows={4}
                                                    required
                                                />
                                            </div>

                                            <Button type="submit" className="w-full bg-[#8bc34a] hover:bg-[#7cb342] text-white">
                                                Send Us Message
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Methods Section */}
                <section className="container mx-auto max-w-5xl py-2 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {contactMethods.map((method, index) => (
                            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-2 flex flex-col items-center">
                                    <div className="bg-gray-100 p-3 rounded-full mb-4">
                                        <method.icon className="h-6 w-6 text-gray-700" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2 text-center">{method.title}</h3>
                                    <p className="text-center text-gray-600 mb-2">
                                        {method.href ? (
                                            <a href={method.href} className="text-green-600 hover:underline">
                                                {method.contact}
                                            </a>
                                        ) : (
                                            <span className="text-green-600 font-semibold">{method.contact}</span>
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-500">{method.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Business Hours Section */}
                    <div className="mt-12 bg-gray-50 rounded-lg p-6 shadow-md">
                        <div className="flex items-center mb-6">
                            <Clock className="h-8 w-8 text-[#0a1a35] mr-3" />
                            <h2 className="text-2xl font-bold text-[#0a1a35]">Business Hours & Response Time</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-[#0a1a35]">Operating Hours</h3>
                                <ul className="space-y-2">
                                    {businessHours.map((item, index) => (
                                        <li key={index} className="flex justify-between">
                                            <span className="font-medium">{item.day}</span>
                                            <span>{item.hours}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-[#0a1a35]">Expected Response Times</h3>
                                <ul className="space-y-2">
                                    {responseTimes.map((item, index) => (
                                        <li key={index} className="flex justify-between">
                                            <span className="font-medium">{item.type}</span>
                                            <span>{item.time}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> Our customer support team is committed to responding to all inquiries as quickly as
                                possible. For urgent matters outside of business hours, please use our 24/7 emergency contact number.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Chat Support Widget */}
                <div className="fixed bottom-6 right-6 z-50">
                    {chatOpen ? (
                        <Card className="w-80 shadow-xl animate-fade-in">
                            <div className="bg-[#8bc34a] text-white p-3 flex justify-between items-center rounded-t-lg">
                                <div className="flex items-center">
                                    <MessageSquare className="h-5 w-5 mr-2" />
                                    <span>Customer Support</span>
                                </div>
                                <button
                                    onClick={() => setChatOpen(false)}
                                    className="text-white hover:text-gray-200 transition-colors"
                                    aria-label="Close chat"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <CardContent className="p-0">
                                <div className="p-4 border-b">
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                                        <div>
                                            <p className="text-sm font-medium">Customer Support</p>
                                            <p className="text-xs text-gray-500">New messages</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#8bc34a]/10 p-3 rounded-lg mb-3 max-w-[80%]">
                                        <p className="text-sm">👋 Hi! How can we help?</p>
                                    </div>
                                    <div className="bg-gray-100 p-3 rounded-lg ml-auto max-w-[80%]">
                                        <p className="text-sm">I have a question</p>
                                    </div>
                                </div>
                                <div className="p-3 flex">
                                    <Input
                                        placeholder="Type your message..."
                                        className="rounded-r-none"
                                    />
                                    <Button className="rounded-l-none bg-[#8bc34a] hover:bg-[#7cb342]">
                                        Send
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Button
                            onClick={() => setChatOpen(true)}
                            className="h-14 w-14 rounded-full bg-[#8bc34a] hover:bg-[#7cb342] shadow-lg transition-all hover:scale-105"
                            aria-label="Open chat"
                        >
                            <MessageSquare className="h-6 w-6" />
                        </Button>
                    )}
                </div>
            </div>
        </Layout>
    );
}