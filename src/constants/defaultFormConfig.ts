export const DEFAULT_FORM_CONFIG = {
    steps: [
      {
        id: 1,
        name: "basicInfo",
        title: "Tell us about yourself",
        description: "Basic Information",
        fields: [
          { id: "name", type: "text", label: "Full Name", placeholder: "Enter your full name", required: true },
          { id: "email", type: "email", label: "Email Address", placeholder: "Enter your email", required: false },
          { id: "phone", type: "tel", label: "Phone Number", placeholder: "Enter your phone number", required: true },
          { id: "city", type: "text", label: "City", placeholder: "Enter your city", required: true }
        ]
      },
      {
        id: 2,
        name: "projectType",
        title: "What are you planning?",
        description: "Project Type",
        fields: [
          { 
            id: "projectType", 
            type: "radio", 
            label: "Select Project Type", 
            options: [
              { id: "apartement", label: "Apartment" },
              { id: "villa", label: "Villa" },
              { id: "shop", label: "Shop" },
              { id: "restaurant", label: "Restaurant" },
              { id: "office", label: "Office" },
              { id: "beautySalon", label: "Beauty Salon" }
            ],
            required: true 
          }
        ]
      },
      {
        id: 3,
        name: "projectDetails",
        title: "Project Details",
        description: "Budget & Timeline",
        fields: [
          { 
            id: "budgetTier", 
            type: "radio", 
            label: "Budget Range", 
            options: [
              { id: "economy", label: "Economy" },
              { id: "standard", label: "Standard" },
              { id: "premium", label: "Premium" },
              { id: "luxury", label: "Luxury" }
            ],
            required: false 
          },
          { id: "budgetExact", type: "text", label: "Exact Budget", placeholder: "Or enter exact budget...", required: false },
          { 
            id: "areaTier", 
            type: "radio", 
            label: "Project Area", 
            options: [
              { id: "small", label: "Small" },
              { id: "medium", label: "Medium" },
              { id: "large", label: "Large" },
              { id: "veryLarge", label: "Very Large" }
            ],
            required: false 
          },
          { id: "areaExact", type: "text", label: "Exact Area", placeholder: "Or enter exact area in sqm...", required: false },
          { 
            id: "timeline", 
            type: "radio", 
            label: "Timeline", 
            options: [
              { id: "urgent", label: "Urgent" },
              { id: "normal", label: "Normal" },
              { id: "relaxed", label: "Relaxed" },
              { id: "flexible", label: "Flexible" }
            ],
            required: true 
          }
        ]
      },
      {
        id: 4,
        name: "projectSpecifics",
        title: "Project Specifics",
        description: "Additional Details",
        fields: [
          { id: "floorsCount", type: "radio", label: "Number of Floors", options: [{id: "1", label: "1"}, {id: "2", label: "2"}, {id: "3", label: "3"}, {id: "4+", label: "4+"}], required: false },
          { id: "roomCount", type: "radio", label: "Number of Rooms", options: [{id: "1", label: "1"}, {id: "2", label: "2"}, {id: "3", label: "3"}, {id: "4+", label: "4+"}], required: false },
          { id: "roomCountExact", type: "number", label: "Exact Room Count", placeholder: "Enter exact number of rooms", required: false }
        ]
      },
      {
        id: 5,
        name: "images",
        title: "Visual Inspiration",
        description: "Upload images to help us understand your vision",
        fields: [
          { id: "inspirationNotes", type: "textarea", label: "Inspiration Notes", placeholder: "Tell us about your inspiration...", required: false }
        ]
      }
    ]
  };
  