import packageJson from "../../package.json";

export function getVersion(): string {
  return packageJson.version;
}

export function getAppInfo() {
  return {
    version: packageJson.version,
    name: packageJson.name || "Ashish Shukla",
    license: packageJson.license,
  };
}
