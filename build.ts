import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import Handlebars from "handlebars";

// --- TypeScript interfaces ---

interface LinkEntry {
  platform: string;
  url: string;
  label?: string;
}

interface ProfileConfig {
  name: string;
  bio?: string;
  avatar: string;
  links?: LinkEntry[];
}

interface PlatformInfo {
  displayName: string;
  svgPath: string;
}

// --- Known platform registry (Simple Icons SVG paths) ---

const KNOWN_PLATFORMS: Record<string, PlatformInfo> = {
  x: {
    displayName: "X",
    svgPath:
      "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
  github: {
    displayName: "GitHub",
    svgPath:
      "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  linkedin: {
    displayName: "LinkedIn",
    svgPath:
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  instagram: {
    displayName: "Instagram",
    svgPath:
      "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8504.6165 19.0872.321 18.2143.12 16.9366.0645 15.6588.0091 15.2479-.0046 11.9999.0009 8.7527.0064 8.3439.0209 7.0689.0777l-.0387.0064zm.4523 2.1636c1.2648-.0543 1.6392-.0645 4.8493-.0645h-.0025c3.2128 0 3.5867.0117 4.8527.0694 1.1707.0533 1.8061.2497 2.2293.4147.5604.218.96.4781 1.3806.8991.4207.4209.6804.8196.8985 1.3804.1637.422.3604 1.0579.413 2.2286.0576 1.2663.07 1.6459.07 4.8477 0 3.2018-.0124 3.5815-.0696 4.8478-.0543 1.1707-.2514 1.806-.4154 2.2286-.2178.5604-.4779.96-.8985 1.3806-.4192.4178-.8197.6806-1.3802.8984-.4215.1637-1.0581.3604-2.2286.4132-1.2655.0576-1.6448.0694-4.8493.0694-3.2045 0-3.5838-.0118-4.8493-.0694-1.1707-.0528-1.8061-.2495-2.2293-.4132-.5604-.2178-.96-.4806-1.3806-.8984-.4207-.4206-.6804-.8202-.8985-1.3806-.1637-.4226-.3604-1.0579-.4132-2.2286-.0576-1.2663-.07-1.646-.07-4.8494s.0124-3.5799.0694-4.8461c.0534-1.1707.2497-1.806.4148-2.2302.2178-.5604.4781-.96.8984-1.3806.4206-.4177.8196-.6804 1.3806-.8984.4226-.1637 1.0579-.3604 2.2286-.4139 1.266-.0573 1.6459-.0698 4.8509-.0698l-.003.0019zm9.6165 1.9981a1.44 1.44 0 1 0 0 2.8818 1.44 1.44 0 0 0 0-2.8818zM12.0003 5.8383a6.1623 6.1623 0 1 0 .001 12.3247 6.1623 6.1623 0 0 0-.001-12.3247zM12 9.997a4.003 4.003 0 1 1-.003 8.007A4.003 4.003 0 0 1 12 9.997z",
  },
  facebook: {
    displayName: "Facebook",
    svgPath:
      "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.613.115v3.146c-.427-.044-.602-.044-1.07-.044-1.514 0-2.099.572-2.099 2.06v2.281h3.035l-.519 3.667h-2.516v7.98C19.395 23.032 24 18.062 24 12.073 24 5.413 18.627 0 12 0S0 5.413 0 12.073c0 5.394 3.893 9.883 9.101 11.618Z",
  },
  youtube: {
    displayName: "YouTube",
    svgPath:
      "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  speakerdeck: {
    displayName: "Speaker Deck",
    svgPath:
      "M24 5.323v13.354c0 1.129-.916 2.045-2.045 2.045H2.045A2.045 2.045 0 0 1 0 18.677V5.323c0-1.13.916-2.045 2.045-2.045h19.91C23.084 3.278 24 4.194 24 5.323zm-2.045-.341a.34.34 0 0 0-.341-.341H2.386a.34.34 0 0 0-.34.341v13.036a.34.34 0 0 0 .34.341h19.228a.34.34 0 0 0 .341-.341V4.982zM6.46 14.478c-.068 0-.136-.026-.188-.078a.266.266 0 0 1 0-.376l4.683-4.683a.266.266 0 0 1 .376 0l4.683 4.683a.266.266 0 0 1-.376.376L11.143 9.905 6.648 14.4a.265.265 0 0 1-.188.078z",
  },
};

// --- Handlebars helpers ---

Handlebars.registerHelper(
  "nl2br",
  (text: string): Handlebars.SafeString => {
    const escaped = Handlebars.Utils.escapeExpression(text.trim());
    return new Handlebars.SafeString(escaped.replace(/\n/g, "<br>"));
  }
);

Handlebars.registerHelper(
  "platformIcon",
  (platform: string): Handlebars.SafeString => {
    const info = KNOWN_PLATFORMS[platform.toLowerCase()];
    if (!info) return new Handlebars.SafeString("");
    return new Handlebars.SafeString(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${info.svgPath}"/></svg>`
    );
  }
);

Handlebars.registerHelper(
  "displayName",
  (link: LinkEntry): string => {
    if (link.label) return link.label;
    const info = KNOWN_PLATFORMS[link.platform.toLowerCase()];
    return info ? info.displayName : link.platform;
  }
);

// --- YAML loading and validation ---

function loadProfile(configPath: string): ProfileConfig {
  if (!fs.existsSync(configPath)) {
    console.error(`Error: ${configPath} not found.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  const data = yaml.load(raw) as Record<string, unknown>;

  if (!data || typeof data !== "object") {
    console.error("Error: profile.yml is empty or invalid.");
    process.exit(1);
  }

  if (!data.name || typeof data.name !== "string") {
    console.error("Error: 'name' is required and must be a non-empty string.");
    process.exit(1);
  }

  if (!data.avatar || typeof data.avatar !== "string") {
    console.error(
      "Error: 'avatar' is required and must be a non-empty string."
    );
    process.exit(1);
  }

  const isExternalAvatar =
    data.avatar.startsWith("http://") || data.avatar.startsWith("https://");
  if (!isExternalAvatar && !fs.existsSync(data.avatar)) {
    console.error(`Error: Avatar file not found: ${data.avatar}`);
    process.exit(1);
  }

  const validLinks: LinkEntry[] = [];
  const linksData = Array.isArray(data.links) ? data.links : Array.isArray(data.sns) ? data.sns : [];
  for (const entry of linksData) {
    const item = entry as Record<string, unknown>;
    if (!item.platform || typeof item.platform !== "string") {
      console.warn("Warning: Link entry missing 'platform', skipping.");
      continue;
    }
    if (!item.url || typeof item.url !== "string") {
      console.warn(
        `Warning: Link entry '${item.platform}' missing 'url', skipping.`
      );
      continue;
    }
    if (
      !item.url.startsWith("http://") &&
      !item.url.startsWith("https://")
    ) {
      console.warn(
        `Warning: Link entry '${item.platform}' has malformed URL '${item.url}', skipping.`
      );
      continue;
    }
    validLinks.push({
      platform: item.platform,
      url: item.url,
      label: typeof item.label === "string" ? item.label : undefined,
    });
  }

  return {
    name: data.name,
    bio: typeof data.bio === "string" ? data.bio : undefined,
    avatar: data.avatar,
    links: validLinks,
  };
}

// --- Build ---

function build(): void {
  const configPath = path.resolve("profile.yml");
  const templatePath = path.resolve("templates/index.html.hbs");
  const outputDir = path.resolve("dist");
  const outputPath = path.join(outputDir, "index.html");

  const profile = loadProfile(configPath);

  // Handle avatar source
  let avatarSrc: string;
  if (
    profile.avatar.startsWith("http://") ||
    profile.avatar.startsWith("https://")
  ) {
    avatarSrc = profile.avatar;
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
    const avatarFileName = path.basename(profile.avatar);
    fs.copyFileSync(profile.avatar, path.join(outputDir, avatarFileName));
    avatarSrc = avatarFileName;
  }

  // Avatar initial for fallback
  const avatarInitial = profile.name.charAt(0).toUpperCase();

  const templateSrc = fs.readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile(templateSrc);

  const html = template({
    name: profile.name,
    bio: profile.bio,
    avatar: avatarSrc,
    avatarInitial,
    links: profile.links,
    hasLinks: (profile.links ?? []).length > 0,
  });

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, html, "utf-8");
  console.log(`Built: ${outputPath}`);
}

build();
