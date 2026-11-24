const { randomBytes, scryptSync } = require("node:crypto");

function promptForPassword() {
  if (!process.stdin.isTTY) {
    console.error("Run this command in an interactive terminal.");
    process.exit(1);
  }

  return new Promise((resolve) => {
    let value = "";
    process.stdout.write("Enter a new admin password: ");
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");
    process.stdin.resume();
    process.stdin.on("data", (chunk) => {
      for (const character of chunk) {
        if (character === "\r" || character === "\n") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write("\n");
          resolve(value);
          return;
        }
        if (character === "\u0003") process.exit(130);
        if (character === "\b" || character === "\u007f") {
          if (value.length) { value = value.slice(0, -1); process.stdout.write("\b \b"); }
          continue;
        }
        value += character;
        process.stdout.write("*");
      }
    });
  });
}

(async () => {
  const password = process.argv.slice(2).join(" ") || await promptForPassword();
  if (!password || password.length < 12) {
    console.error("Use a unique password of at least 12 characters.");
    process.exit(1);
  }
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  // Use dots: `$` is interpreted as a variable reference in Next.js .env files.
  console.log(`scrypt.${salt.toString("base64url")}.${hash.toString("base64url")}`);
})();
