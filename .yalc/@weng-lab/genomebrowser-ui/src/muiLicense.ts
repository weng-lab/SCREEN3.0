import { LicenseInfo } from "@mui/x-license";

const muiLicenseKey =
  import.meta.env.NEXT_PUBLIC_MUI_X_LICENSE_KEY ??
  import.meta.env.VITE_MUI_X_LICENSE_KEY;

if (muiLicenseKey) {
  LicenseInfo.setLicenseKey(muiLicenseKey);
}
