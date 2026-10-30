import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import Tooltip from "primevue/tooltip";
import "./assets/main.css";

import App from "./App.vue";
import router from "./router";
import { definePreset } from "@primeuix/themes";
import { option } from "@primeuix/themes/aura/autocomplete";
import { ConfirmationService, ToastService } from "primevue";
import { StorageService } from "./services/storage.service";

// Inisialisasi data dummy awal di LocalStorage
StorageService.initStorage();

// Ekspos helper reset database di window untuk kemudahan demo / testing portfolio
if (typeof window !== "undefined") {
  (window as any).resetWebPosData = () => {
    StorageService.resetStorage();
    window.location.reload();
  };
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

const FlashPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{emerald.50}",
      100: "{emerald.100}",
      200: "{emerald.200}",
      300: "{emerald.300}",
      400: "{emerald.400}",
      500: "{emerald.500}",
      600: "{emerald.600}",
      700: "{emerald.700}",
      800: "{emerald.800}",
      900: "{emerald.900}",
      950: "{emerald.950}",
    },
    colorScheme: {
      light: {
        surface: {
          0: "#ffffff",
          50: "{zinc.50}",
          100: "{zinc.100}",
          200: "{zinc.200}",
          300: "{zinc.300}",
          400: "{zinc.400}",
          500: "{zinc.500}",
          600: "{zinc.600}",
          700: "{zinc.700}",
          800: "{zinc.800}",
          900: "{zinc.900}",
          950: "{zinc.950}",
        },
      },
    },
  },
});
app.use(PrimeVue, {
  theme: {
    preset: FlashPreset,
    options: {
      darkModeSelector: ".app-dark",
    },
  },
});

app.use(ConfirmationService);
app.use(ToastService);

app.directive("tooltip", Tooltip);

app.mount("#app");
