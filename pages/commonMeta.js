import { Images } from "@/data/images";
import moment from "moment";

export const createMetadata = ({
  title = "Budget Planner and Expense Tracker",
  description = "WalletSync offers a secure and user-friendly wallet web app to manage your digital assets effortlessly. Enjoy seamless transactions, advanced security features, and an intuitive interface for an enhanced financial experience.",
  img = Images.main,
  siteName = "WalletSync - Budget Planner and Expense Tracker",
  type = "website",
//   canonical = process.env.NEXT_PUBLIC_URL,
  url = process.env.NEXT_PUBLIC_URL, 
  ...other
} = {}) => {
  return {
    title: `WalletSync - ${title}`,
    description,
    other,
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
    // alternates: {
    //   canonical: canonical + "/",
    // },
    openGraph: {
      title,
      description,
      siteName,
      url,
      type,
      images: img
        ? [{ url: img, width: 1200, height: 630, alt: "Banner Image" }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: img ? [img] : [],
    },
    other: {
      "google-site-verification": "JTnXxz7fJRniJ3ckFGmY6Sa2PD0NfyxFmZbBykhS8dM", // ✅ Added Google verification meta
      // "apple-itunes-app":
      //   "app-id=6608966569, app-argument=https://walletsync.onelink.me/ubEX/8kvejhlv",
    },
  };
};

export const formatDate = (date, format) => {
  return moment(date).format(format);
};

export const formatTime = (time, format) => {
  return moment(time, "HH:mm:ss").format(format);
};