/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "3xl": "0px 0px 5px 0px rgba(0, 0, 0, 0.75)",
        shPrimary: "0px 0px 10px 0px rgba(0,0,0,0.1)",
      },

      colors: {
        // Light Mode
        boxcolor: "#F1F5F9",
        boxAcent: "#ffff",
        boxcolor2: "#E5E7EB",
        textLightMode: "#000",
        fontInput: "#F9FBFD",
        // Font Colors Buttons Light Mode
        btnLight: "#DDE2E7",
        primary: "#006FEE",
        secondary: "#9353d3",
        success: "#17c964",
        warning: "#f5a524",
        default: "#3f3f46",
        danger: "#EF4444",
        shippetAmz: "#0BC5EA",
        confirmWhc: "#3182CE",
        deliveredAtt: "#a200ff",
        toWhc: "#F6AD55",
        partialReceived: "#bd6c97",

        // Dark Mode

        darkBox: "#040d19",
        darkBg: "#071426",
        darkText: "#D1D5DB",
        darkFontInput: "#111827",
        // Font Colors Buttons Dark Mode
        btnDark: "#2D3748",
        textDarkMode: "#000",
        darkText2: "#9CA3AF",
        btnDefault: "#AEAFB3",
        btnSuccess: "#CAEEDA",
        btnWarning: "#FBDBA7",
        btnDanger: "#FCAEAE",
        btnPrimary: "#A2D2FF",
        btnSecondary: "#FFB8EB",
        blow: "linear-gradient(180deg, #FFFFFF 0%, #F7F8FA 100%)",
      },
      fontFamily: {
        header: ["LilitaOne-Regular", "sans-serif"],
      },
      width: {
        inputSize: "220px",
    
        // modals
        modal: "550px",
      },
      height: {
        inputSize: "30px",
        // modals
        modal: "600px",
        modalSm: "400px",
      },
    },
  },
  plugins: [],
}