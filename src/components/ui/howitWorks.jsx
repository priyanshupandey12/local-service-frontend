import { useState } from "react";
import { useNavigate } from "react-router-dom";

const customerSteps = [
  {
    image: "https://img.icons8.com/?size=100&id=23297&format=png&color=000000",
    title: "1. Find your Pro",
    description: "Search for the service you need and browse through vetted, top-rated experts near you.",
  },
  {
    image: "https://img.icons8.com/?size=100&id=122843&format=png&color=000000",
    title: "2. Book instantly",
    description: "Select a date and time that works for you. Get an upfront quote before you confirm.",
  },
  {
    image: "https://img.icons8.com/?size=100&id=81438&format=png&color=000000",
    title: "3. Get it done",
    description: "Your pro arrives, handles the task, and you pay securely once you're satisfied.",
  },
];

const providerSteps = [
  {
    image: "https://img.icons8.com/?size=100&id=11926&format=png&color=000000",
    title: "1. Create your profile",
    description: "Register as a provider, complete your profile with your skills, category, city and area.",
  },
  {
    image: "https://img.icons8.com/?size=100&id=113639&format=png&color=000000",
    title: "2. Get approved",
    description: "Our admin team reviews your profile and approves you to start accepting jobs.",
  },
  {
    image: "https://img.icons8.com/?size=100&id=gaZefe71Fc0s&format=png&color=000000",
    title: "3. Start earning",
    description: "Toggle your availability, accept booking requests and grow your business.",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("customer");
  const steps = active === "customer" ? customerSteps : providerSteps;

  return (
    <section className="bg-gray-900 px-6 py-16 rounded-3xl mx-6 my-8">
      <div className="max-w-4xl mx-auto">


        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-6">How it Works</h2>

    
          <div className="inline-flex bg-gray-800 rounded-full p-1 gap-1">
            <button
              onClick={() => setActive("customer")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                active === "customer"
                  ? "bg-white text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              For Customers
            </button>
            <button
              onClick={() => setActive("provider")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                active === "provider"
                  ? "bg-white text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              For Providers
            </button>
          </div>
        </div>

<div className="grid grid-cols-3 gap-8 mb-16">
  {steps.map((step, index) => (
    <div key={index} className="text-center relative">

      {index < steps.length - 1 && (
        <div className="absolute top-10 left-1/2 w-full border-t border-dashed border-gray-600" />
      )}


      <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 relative z-10 ">
        <img
          src={step.image}
          alt={step.title}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
      <p className="text-xs text-gray-400 leading-relaxed">{step.description}</p>
    </div>
  ))}
</div>

 


      </div>
    </section>
  );
};

export default HowItWorks;