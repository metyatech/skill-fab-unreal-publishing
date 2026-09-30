import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillPath = join(root, "SKILL.md");
const skillText = readFileSync(skillPath, "utf8");
const frontmatter = skillText.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

if (!frontmatter) {
  throw new Error("SKILL.md must start with a YAML frontmatter block.");
}

const metadata = parse(frontmatter[1]);
if (metadata?.name !== "fab-unreal-publishing") {
  throw new Error('SKILL.md frontmatter name must be "fab-unreal-publishing".');
}
if (
  typeof metadata.description !== "string" ||
  metadata.description.trim() === ""
) {
  throw new Error("SKILL.md frontmatter must contain a non-empty description.");
}

const markdownFiles = [];
function collectMarkdown(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collectMarkdown(path);
    else if (extname(entry.name).toLowerCase() === ".md")
      markdownFiles.push(path);
  }
}

collectMarkdown(root);
const markdownLink = /\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+[^)]*)?\)/g;
const failures = [];

for (const sourcePath of markdownFiles) {
  const source = readFileSync(sourcePath, "utf8");
  for (const match of source.matchAll(markdownLink)) {
    const destination = match[1].replace(/^<|>$/g, "");
    if (
      /^(?:https?:|mailto:|tel:|data:)/i.test(destination) ||
      destination.startsWith("#")
    )
      continue;

    const targetPath = resolve(
      dirname(sourcePath),
      decodeURIComponent(destination.split("#", 1)[0]),
    );
    if (!existsSync(targetPath)) {
      failures.push(
        `${sourcePath.slice(root.length + 1)}: missing local link ${destination}`,
      );
    }
  }
}

for (const path of [
  "references/media-design.md",
  "references/evidence.md",
  "references/human-approval.md",
]) {
  if (!existsSync(join(root, path)))
    failures.push(`Missing required reference: ${path}`);
}

if (failures.length > 0) {
  throw new Error(failures.join("\n"));
}

console.log(
  `Skill frontmatter and ${markdownFiles.length} Markdown files passed local-link validation.`,
);
