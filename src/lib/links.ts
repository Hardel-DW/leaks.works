export const LINKS = {
    modrinth: "https://modrinth.com/mod/leafs",
    github: "https://github.com/Hardel-DW/leafs.mods",
    discord: "https://discord.gg/TAmVFvkHep",
    x: "https://x.com/Hardel7401",
    bluesky: "https://bsky.app/profile/hardoudou.bsky.social"
} as const;

export const DEPENDENCIES = [
    { name: "Fabric API", url: "https://modrinth.com/mod/fabric-api" },
    { name: "Mapple", url: "https://modrinth.com/mod/mapple" },
    { name: "ScalableLux", url: "https://modrinth.com/mod/scalablelux" },
    { name: "FastNoise", url: "https://modrinth.com/mod/zfastnoise" }
] as const;
