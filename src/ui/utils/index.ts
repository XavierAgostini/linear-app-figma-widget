export const getLinearUserInitials = (displayName: string) => {
  const t = displayName.includes("@") ? displayName.split("@")[0].replace(/\./, " ") : displayName
    , n = t.match(/\S+/g) || [];

  return n.length > 1 && n[0] ? `${n[0][0]}${n[n.length - 1][0]}`.toUpperCase() : t.slice(0, 2).toUpperCase()
}
