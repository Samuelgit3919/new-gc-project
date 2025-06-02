import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Calendar,
    Clock,
    MapPin,
    Phone,
    Mail,
    Globe,
    Facebook,
    Instagram,
    Twitter,
    Upload,
    Plus,
    Trash2,
    ChevronDown,
} from "lucide-react";

export default function BookstoreProfilePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        tagline: "",
        description: "",
        phone: "",
        email: "",
        website: "",
        address: "",
        mapsLink: "",
        facebook: "",
        instagram: "",
        twitter: "",
        logo: null,
        banner: null,
    });

    const [events, setEvents] = useState([{ id: "1", name: "", date: "", time: "", description: "" }]);

    const [operatingHours, setOperatingHours] = useState({
        monday: { open: "09:00", close: "18:00", closed: false },
        tuesday: { open: "09:00", close: "18:00", closed: false },
        wednesday: { open: "09:00", close: "18:00", closed: false },
        thursday: { open: "09:00", close: "18:00", closed: false },
        friday: { open: "09:00", close: "20:00", closed: false },
        saturday: { open: "10:00", close: "20:00", closed: false },
        sunday: { open: "12:00", close: "17:00", closed: false },
    });

    const [selectedServices, setSelectedServices] = useState([]);

    const services = [
        "Café",
        "Reading Area",
        "Author Events",
        "Children's Corner",
        "Free Wi-Fi",
        "Book Club",
        "Gift Wrapping",
        "Special Orders",
        "Book Recommendations",
        "Study Space",
    ];

    const daysOfWeek = [
        { key: "monday", label: "Monday" },
        { key: "tuesday", label: "Tuesday" },
        { key: "wednesday", label: "Wednesday" },
        { key: "thursday", label: "Thursday" },
        { key: "friday", label: "Friday" },
        { key: "saturday", label: "Saturday" },
        { key: "sunday", label: "Sunday" },
    ];

    // Accordion state for Operating Hours on mobile
    const [isOperatingHoursOpen, setIsOperatingHoursOpen] = useState(false);

    // Accordion state for each day's time input on mobile
    const [openDayDropdown, setOpenDayDropdown] = useState(null); // e.g. 'monday', 'tuesday', ...

    // Validate form fields
    const validateField = (field, value) => {
        const errors = {};

        if (field === 'name' && !value.trim()) {
            errors.name = 'Bookstore name is required';
        }

        if (field === 'phone') {
            if (!value.trim()) {
                errors.phone = 'Phone number is required';
            } else if (!validatePhone(value)) {
                errors.phone = 'Please enter a valid phone number (e.g., +1234567890 or 123-456-7890)';
            }
        }

        if (field === 'email') {
            if (!value.trim()) {
                errors.email = 'Email address is required';
            } else if (!validateEmail(value)) {
                errors.email = 'Please enter a valid email address';
            }
        }

        if (field === 'address' && !value.trim()) {
            errors.address = 'Physical address is required';
        }

        return errors;
    };

    // Validate phone number format
    const validatePhone = (phone) => {
        const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
        return phoneRegex.test(phone);
    };

    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate URL format
    const validateUrl = (url) => {
        if (!url) return true; // Optional field
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Handle form input changes with validation
    const handleInputChange = (e) => {
        const { id, value } = e.target;

        // Validate the field
        const fieldErrors = validateField(id, value);
        setFormErrors(prev => ({ ...prev, ...fieldErrors }));

        // Update form data
        setFormData(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    // Handle file uploads with validation
    const handleFileChange = (e) => {
        const { id, files } = e.target;
        if (files[0]) {
            const maxSize = id === "logo" ? 2 * 1024 * 1024 : 5 * 1024 * 1024; // 2MB or 5MB
            if (files[0].size > maxSize) {
                setFormErrors(prev => ({
                    ...prev,
                    [id]: `${id === "logo" ? "Logo" : "Banner"} must be under ${maxSize / (1024 * 1024)}MB`
                }));
                return;
            }

            // Clear any previous errors
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });

            setFormData(prev => ({ ...prev, [id]: files[0] }));
        }
    };

    // Validate all required fields before submission
    const validateForm = () => {
        const errors = {};

        // Required fields
        if (!formData.name.trim()) errors.name = 'Bookstore name is required';
        if (!formData.phone || !formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone.trim())) {
            errors.phone = 'Please enter a valid phone number (e.g., +1234567890 or 123-456-7890)';
        }
        if (!formData.email.trim()) errors.email = 'Email address is required';
        if (!formData.address.trim()) errors.address = 'Physical address is required';

        // Format validation
        if (formData.email.trim() && !validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (formData.website && !validateUrl(formData.website)) {
            errors.website = 'Please enter a valid URL';
        }

        if (formData.mapsLink && !validateUrl(formData.mapsLink)) {
            errors.mapsLink = 'Please enter a valid URL';
        }

        if (formData.facebook && !validateUrl(formData.facebook)) {
            errors.facebook = 'Please enter a valid URL';
        }

        if (formData.instagram && !validateUrl(formData.instagram)) {
            errors.instagram = 'Please enter a valid URL';
        }

        if (formData.twitter && !validateUrl(formData.twitter)) {
            errors.twitter = 'Please enter a valid URL';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Add a new event
    const addEvent = () => {
        const newEvent = {
            id: Date.now().toString(),
            name: "",
            date: "",
            time: "",
            description: "",
        };
        setEvents([...events, newEvent]);
    };

    // Remove an event
    const removeEvent = (id) => {
        if (events.length > 1) {
            setEvents(events.filter((event) => event.id !== id));
        } else {
            toast.info("You need to keep at least one event. Clear the fields instead.");
        }
    };

    // Update event fields
    const updateEvent = (id, field, value) => {
        setEvents(events.map((event) => (event.id === id ? { ...event, [field]: value } : event)));
    };

    // Update operating hours
    const updateOperatingHours = (day, field, value) => {
        setOperatingHours((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value,
            },
        }));
    };

    // Toggle services
    const toggleService = (service) => {
        setSelectedServices((prev) =>
            prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
        );
    };

    // Reset the entire form
    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all form data?")) {
            setFormData({
                name: "",
                tagline: "",
                description: "",
                phone: "",
                email: "",
                website: "",
                address: "",
                mapsLink: "",
                facebook: "",
                instagram: "",
                twitter: "",
                logo: null,
                banner: null,
            });
            setEvents([{ id: "1", name: "", date: "", time: "", description: "" }]);
            setSelectedServices([]);
            setOperatingHours({
                monday: { open: "09:00", close: "18:00", closed: false },
                tuesday: { open: "09:00", close: "18:00", closed: false },
                wednesday: { open: "09:00", close: "18:00", closed: false },
                thursday: { open: "09:00", close: "18:00", closed: false },
                friday: { open: "09:00", close: "20:00", closed: false },
                saturday: { open: "10:00", close: "20:00", closed: false },
                sunday: { open: "12:00", close: "17:00", closed: false },
            });
            setFormErrors({});
            setHasAttemptedSubmit(false);
            toast.success("Form has been reset");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasAttemptedSubmit(true);

        // Validate the form
        if (!validateForm()) {
            if (!formData.phone || !formData.phone.trim()) {
                toast.error("Phone number is required");
            } else if (!validatePhone(formData.phone.trim())) {
                toast.error("Please enter a valid phone number (e.g., +1234567890 or 123-456-7890)");
            } else {
                toast.error("Please fix the errors in the form before submitting");
            }
            return;
        }

        setIsSubmitting(true);

        try {
            // Verify token
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication token is missing. Please log in.");
                setIsSubmitting(false);
                return;
            }

            // Prepare FormData with server-side field names
            const formDataToSend = new FormData();

            // Required fields
            formDataToSend.append('name', formData.name.trim());
            formDataToSend.append('contactPhone', formData.phone.trim());
            formDataToSend.append('address', formData.address.trim());
            formDataToSend.append('location', formData.mapsLink.trim());

            // Optional fields
            if (formData.tagline) formDataToSend.append('tagline', formData.tagline.trim());
            if (formData.description) formDataToSend.append('description', formData.description.trim());
            if (formData.email) formDataToSend.append('contactEmail', formData.email.trim());
            if (formData.website) formDataToSend.append('contactWebsite', formData.website.trim());
            if (formData.facebook) formDataToSend.append('facebookUrl', formData.facebook.trim());
            if (formData.instagram) formDataToSend.append('instagramUrl', formData.instagram.trim());
            if (formData.twitter) formDataToSend.append('twitterUrl', formData.twitter.trim());

            // Services (comma-separated string)
            if (selectedServices.length > 0) {
                formDataToSend.append('services', selectedServices.join(','));
            }

            // Payment providers and phone numbers (if you have these fields in your UI, add them here)
            // Example:
            // if (paymentProviders.length > 0) formDataToSend.append('paymentProviders', paymentProviders.join(','));
            // if (paymentPhoneNumbers.length > 0) formDataToSend.append('paymentPhoneNumbers', paymentPhoneNumbers.join(','));

            // Operating hours: convert to "mondayHours", "tuesdayHours", ...
            const dayMap = {
                monday: 'mondayHours',
                tuesday: 'tuesdayHours',
                wednesday: 'wednesdayHours',
                thursday: 'thursdayHours',
                friday: 'fridayHours',
                saturday: 'saturdayHours',
                sunday: 'sundayHours',
            };
            Object.entries(operatingHours).forEach(([day, value]) => {
                let hoursString = '';
                if (value.closed) {
                    hoursString = 'Closed';
                } else {
                    // Format: "9:00 AM - 5:00 PM"
                    const open = value.open ? to12Hour(value.open) : '';
                    const close = value.close ? to12Hour(value.close) : '';
                    hoursString = open && close ? `${open} - ${close}` : '';
                }
                if (hoursString) {
                    formDataToSend.append(dayMap[day], hoursString);
                }
            });

            // Logo and background
            if (formData.logo) formDataToSend.append('logo', formData.logo);
            if (formData.banner) formDataToSend.append('background', formData.banner);

            // Helper: convert 24h time to 12h AM/PM
            function to12Hour(timeStr) {
                if (!timeStr) return '';
                const [h, m] = timeStr.split(':');
                let hour = parseInt(h, 10);
                const min = m;
                const ampm = hour >= 12 ? 'PM' : 'AM';
                hour = hour % 12;
                if (hour === 0) hour = 12;
                return `${hour}:${min} ${ampm}`;
            }

            // Debug: log all FormData entries
            for (let pair of formDataToSend.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await fetch("https://bookcompass.onrender.com/api/bookshop", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error response:", errorData);

                // Handle specific error messages from server
                if (errorData.message) {
                    throw new Error(errorData.message);
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            }

            const result = await response.json();
            toast.success("Bookstore profile saved successfully!");
            console.log("API Response:", result);

            // Reset all form fields after successful save
            setFormData({
                name: "",
                tagline: "",
                description: "",
                phone: "",
                email: "",
                website: "",
                address: "",
                mapsLink: "",
                facebook: "",
                instagram: "",
                twitter: "",
                logo: null,
                banner: null,
            });
            setEvents([{ id: "1", name: "", date: "", time: "", description: "" }]);
            setSelectedServices([]);
            setOperatingHours({
                monday: { open: "09:00", close: "18:00", closed: false },
                tuesday: { open: "09:00", close: "18:00", closed: false },
                wednesday: { open: "09:00", close: "18:00", closed: false },
                thursday: { open: "09:00", close: "18:00", closed: false },
                friday: { open: "09:00", close: "20:00", closed: false },
                saturday: { open: "10:00", close: "20:00", closed: false },
                sunday: { open: "12:00", close: "17:00", closed: false },
            });
            setFormErrors({});
            setHasAttemptedSubmit(false);
        } catch (error) {
            console.error("Error submitting form:", error);

            // Show appropriate error message
            if (error.message.includes("401")) {
                toast.error("Session expired. Please log in again.");
                // Optionally redirect to login
            } else if (error.message.includes("Phone number is required")) {
                setFormErrors(prev => ({ ...prev, phone: error.message }));
                toast.error(error.message);
            } else {
                toast.error(`Failed to save: ${error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Effect to validate fields after user interaction
    useEffect(() => {
        if (hasAttemptedSubmit) {
            validateForm();
        }
    }, [formData, hasAttemptedSubmit]);

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-6">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="mx-auto max-w-4xl space-y-6 gap-y-6 px-2 sm:px-4">
                <div className="space-y-2 mb-8 mt-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Bookstore Profile</h1>
                    <p className="text-center text-gray-600 text-base sm:text-lg">Complete your bookstore's profile information</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bookstore Identity */}
                    <Card className="rounded-lg shadow bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">Bookstore Identity</CardTitle>
                            <CardDescription>Basic information about your bookstore</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 gap-4 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Bookstore Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter bookstore name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full h-12 text-base ${formErrors.name ? "border-red-500" : ""}`}
                                    />
                                    {formErrors.name && (
                                        <p className="text-sm text-red-500">{formErrors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tagline">Tagline or Slogan</Label>
                                    <Input
                                        id="tagline"
                                        placeholder="Your literary gateway since 1995"
                                        value={formData.tagline}
                                        onChange={handleInputChange}
                                        className="w-full h-12 text-base"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Brief Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your bookstore and what makes it unique..."
                                    className="min-h-[100px] w-full text-base"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Services Offered */}
                    <Card className="rounded-lg shadow bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">Services Offered</CardTitle>
                            <CardDescription>Select the services and amenities your bookstore provides</CardDescription>
                        </CardHeader>
                        <CardContent className="gap-4 bg-white">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-4">
                                {services.map((service) => (
                                    <div key={service} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={service}
                                            checked={selectedServices.includes(service)}
                                            onCheckedChange={() => toggleService(service)}
                                        />
                                        <Label htmlFor={service} className="text-sm font-normal cursor-pointer">
                                            {service}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="rounded-lg shadow bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">Contact Information</CardTitle>
                            <CardDescription>How customers can reach and find your bookstore</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 gap-4 bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone Number *
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full h-12 text-base ${formErrors.phone ? "border-red-500" : ""}`}
                                    />
                                    {formErrors.phone && (
                                        <p className="text-sm text-red-500">{formErrors.phone}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email Address *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="info@bookstore.com"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full h-12 text-base ${formErrors.email ? "border-red-500" : ""}`}
                                    />
                                    {formErrors.email && (
                                        <p className="text-sm text-red-500">{formErrors.email}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website" className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Website
                                </Label>
                                <Input
                                    id="website"
                                    type="url"
                                    placeholder="https://www.yourbookstore.com"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className={`w-full h-12 text-base ${formErrors.website ? "border-red-500" : ""}`}
                                />
                                {formErrors.website && (
                                    <p className="text-sm text-red-500">{formErrors.website}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address" className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Physical Address *
                                </Label>
                                <Textarea
                                    id="address"
                                    placeholder="123 Main Street, City, State, ZIP Code"
                                    className={`min-h-[80px] w-full text-base ${formErrors.address ? "border-red-500" : ""}`}
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                                {formErrors.address && (
                                    <p className="text-sm text-red-500">{formErrors.address}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mapsLink">Google Maps Link</Label>
                                <Input
                                    id="mapsLink"
                                    type="url"
                                    placeholder="https://maps.google.com/..."
                                    value={formData.mapsLink}
                                    onChange={handleInputChange}
                                    className={`w-full h-12 text-base ${formErrors.mapsLink ? "border-red-500" : ""}`}
                                />
                                {formErrors.mapsLink && (
                                    <p className="text-sm text-red-500">{formErrors.mapsLink}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operating Hours */}
                    <Card className="rounded-lg shadow bg-white">
                        {/* Header with accordion toggle for mobile */}
                        <CardHeader className="cursor-pointer select-none sm:cursor-default" onClick={() => setIsOperatingHoursOpen((open) => !open)}>
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-lg">
                                    <Clock className="w-5 h-5" />
                                    Operating Hours
                                </div>
                                {/* Chevron only on mobile */}
                                <span className="sm:hidden">
                                    <ChevronDown className={`w-6 h-6 transition-transform duration-200 ${isOperatingHoursOpen ? 'rotate-180' : ''}`} />
                                </span>
                            </div>
                            <CardDescription className="sm:block hidden">Set your bookstore's opening hours for each day of the week</CardDescription>
                            {/* On mobile, show description only when open */}
                            <CardDescription className={`sm:hidden mt-1 text-sm transition-all duration-200 ${isOperatingHoursOpen ? 'block' : 'hidden'}`}>Set your bookstore's opening hours for each day of the week</CardDescription>
                        </CardHeader>
                        {/* Accordion content: always open on desktop, toggle on mobile */}
                        <CardContent className={`space-y-4 gap-4 bg-white transition-all duration-300 overflow-hidden ${isOperatingHoursOpen ? 'max-h-[2000px]' : 'max-h-0 sm:max-h-none'} ${isOperatingHoursOpen || window.innerWidth >= 640 ? 'py-4' : 'py-0'} sm:max-h-none sm:py-4`}
                            style={isOperatingHoursOpen || window.innerWidth >= 640 ? {} : { paddingTop: 0, paddingBottom: 0 }}
                        >
                            {(isOperatingHoursOpen || typeof window === 'undefined' || window.innerWidth >= 640) && (
                                <div className="space-y-4">
                                    {daysOfWeek.map(({ key, label }) => {
                                        const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
                                        const isOpen = !operatingHours[key].closed;
                                        const isDropdownOpen = openDayDropdown === key;
                                        return (
                                            <div
                                                key={key}
                                                className={`border rounded-lg px-3 py-2 ${isMobile ? 'cursor-pointer select-none' : ''}`}
                                                onClick={() => {
                                                    if (isMobile && isOpen) setOpenDayDropdown(openDayDropdown === key ? null : key);
                                                }}
                                            >
                                                <div className="flex items-center gap-2 justify-between">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className="w-20 font-medium text-sm min-w-0">{label}</div>
                                                        {/* Radio buttons for Open/Closed */}
                                                        <div className="flex items-center gap-2 ml-2">
                                                            <label className="flex items-center gap-1 text-sm">
                                                                <input
                                                                    type="radio"
                                                                    name={`${key}-status`}
                                                                    checked={!operatingHours[key].closed}
                                                                    onChange={() => updateOperatingHours(key, 'closed', false)}
                                                                    className="accent-purple-600"
                                                                    onClick={e => e.stopPropagation()}
                                                                />
                                                                Open
                                                            </label>
                                                            <label className="flex items-center gap-1 text-sm">
                                                                <input
                                                                    type="radio"
                                                                    name={`${key}-status`}
                                                                    checked={operatingHours[key].closed}
                                                                    onChange={() => updateOperatingHours(key, 'closed', true)}
                                                                    className="accent-purple-600"
                                                                    onClick={e => e.stopPropagation()}
                                                                />
                                                                Closed
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {/* Chevron for mobile if open */}
                                                    {isMobile && isOpen && (
                                                        <ChevronDown className={`w-5 h-5 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                    )}
                                                </div>
                                                {/* Time inputs: dropdown on mobile, always visible on desktop */}
                                                {isOpen && (
                                                    <div
                                                        className={`flex items-center gap-2 mt-3 transition-all duration-300 overflow-hidden
                                                            ${isMobile ? (isDropdownOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0') : 'max-h-32 opacity-100'}`}
                                                        style={isMobile && !isDropdownOpen ? { padding: 0, margin: 0 } : {}}
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        <Input
                                                            type="time"
                                                            value={operatingHours[key].open}
                                                            onChange={(e) => updateOperatingHours(key, "open", e.target.value)}
                                                            className="w-full h-12 text-base"
                                                        />
                                                        <span className="text-gray-500">to</span>
                                                        <Input
                                                            type="time"
                                                            value={operatingHours[key].close}
                                                            onChange={(e) => updateOperatingHours(key, "close", e.target.value)}
                                                            className="w-full h-12 text-base"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Social Media Links */}
                    <Card className="rounded-lg shadow bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">Social Media Links</CardTitle>
                            <CardDescription>Connect your social media profiles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 gap-4 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="facebook" className="flex items-center gap-2">
                                        <Facebook className="w-4 h-4" />
                                        Facebook
                                    </Label>
                                    <Input
                                        id="facebook"
                                        type="url"
                                        placeholder="https://facebook.com/yourbookstore"
                                        value={formData.facebook}
                                        onChange={handleInputChange}
                                        className={`w-full h-12 text-base ${formErrors.facebook ? "border-red-500" : ""}`}
                                    />
                                    {formErrors.facebook && (
                                        <p className="text-sm text-red-500">{formErrors.facebook}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instagram" className="flex items-center gap-2">
                                        <Instagram className="w-4 h-4" />
                                        Instagram
                                    </Label>
                                    <Input
                                        id="instagram"
                                        type="url"
                                        placeholder="https://instagram.com/yourbookstore"
                                        value={formData.instagram}
                                        onChange={handleInputChange}
                                        className={`w-full h-12 text-base ${formErrors.instagram ? "border-red-500" : ""}`}
                                    />
                                    {formErrors.instagram && (
                                        <p className="text-sm text-red-500">{formErrors.instagram}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="twitter" className="flex items-center gap-2">
                                        <Twitter className="w-4 h-4" />
                                        Twitter
                                    </Label>
                                    <Input
                                        id="twitter"
                                        type="url"
                                        placeholder="https://twitter.com/yourbookstore"
                                        value={formData.twitter}
                                        onChange={handleInputChange}
                                        className={`w-full h-12 text-base ${formErrors.twitter ? "border-red-500" : ""}`}
                                    />
                                    {formErrors.twitter && (
                                        <p className="text-sm text-red-500">{formErrors.twitter}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <Card className="rounded-lg shadow bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="w-5 h-5" />
                                Upcoming Events
                            </CardTitle>
                            <CardDescription>Add information about upcoming events at your bookstore</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 gap-4 bg-white">
                            {events.map((event, index) => (
                                <div key={event.id} className="p-4 border rounded-lg space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Event {index + 1}</h4>
                                        {events.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeEvent(event.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`event-name-${event.id}`}>Event Name</Label>
                                            <Input
                                                id={`event-name-${event.id}`}
                                                value={event.name}
                                                onChange={(e) => updateEvent(event.id, "name", e.target.value)}
                                                placeholder="Book signing, Reading club..."
                                                className="w-full h-12 text-base"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`event-date-${event.id}`}>Date</Label>
                                            <Input
                                                id={`event-date-${event.id}`}
                                                type="date"
                                                value={event.date}
                                                onChange={(e) => updateEvent(event.id, "date", e.target.value)}
                                                className="w-full h-12 text-base"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`event-time-${event.id}`}>Time</Label>
                                            <Input
                                                id={`event-time-${event.id}`}
                                                type="time"
                                                value={event.time}
                                                onChange={(e) => updateEvent(event.id, "time", e.target.value)}
                                                className="w-full h-12 text-base"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`event-description-${event.id}`}>Description</Label>
                                        <Textarea
                                            id={`event-description-${event.id}`}
                                            value={event.description}
                                            onChange={(e) => updateEvent(event.id, "description", e.target.value)}
                                            placeholder="Describe the event..."
                                            className="min-h-[80px] w-full text-base"
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addEvent} className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Another Event
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card className="rounded-lg shadow bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">Images</CardTitle>
                            <CardDescription>Upload your bookstore logo and banner image</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 gap-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="logo">Bookstore Logo</Label>
                                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${formErrors.logo ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                                        }`}>
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600 mb-2">Click to upload logo</p>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                                        {formData.logo && (
                                            <p className="text-sm text-green-600 mt-2">
                                                Selected: {formData.logo.name}
                                            </p>
                                        )}
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    {formErrors.logo && (
                                        <p className="text-sm text-red-500">{formErrors.logo}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="banner">Banner Image</Label>
                                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${formErrors.banner ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                                        }`}>
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600 mb-2">Click to upload banner</p>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                        {formData.banner && (
                                            <p className="text-sm text-green-600 mt-2">
                                                Selected: {formData.banner.name}
                                            </p>
                                        )}
                                        <Input
                                            id="banner"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    {formErrors.banner && (
                                        <p className="text-sm text-red-500">{formErrors.banner}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card className="rounded-lg shadow bg-white">
                        <CardContent className="pt-6 bg-white">
                            <div className="flex flex-col sm:flex-row gap-2 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    className="w-full sm:w-auto h-12 text-base"
                                    disabled={isSubmitting}
                                >
                                    Reset Form
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto h-12 text-base"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : "Save Profile"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}