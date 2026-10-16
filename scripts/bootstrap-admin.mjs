const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: npm run admin:bootstrap -- owner@example.com");
  process.exit(1);
}
console.log("Set this hosted environment value before opening /admin:");
console.log(`ADMIN_EMAIL_ALLOWLIST=${email}`);
console.log(
  "No password is created or stored. The administrator signs in through the hosting platform and is matched server-side to this allowlist.",
);
