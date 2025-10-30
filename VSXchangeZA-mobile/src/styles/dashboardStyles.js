import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117" },
  appbar: { height: 64, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", paddingHorizontal: 12, zIndex: 10 },
  appbarRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  hamburger: { padding: 8 },
  hLine: { width: 22, height: 3, backgroundColor: "#00f0a8", marginVertical: 2, borderRadius: 2 },
  brand: { fontWeight: "800", fontSize: 18, color: "#e8e8ea" },

  body: { flex: 1, flexDirection: "row", padding: 12, gap: 12 },
  sidebar: { width: Math.min(320, width * 0.24) },
  feedCol: { flex: 1, paddingHorizontal: 6 },
  rightCol: { width: Math.min(360, width * 0.28) },

  // sidebar card
  sidebarCard: { width: "100%", padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.04)", borderWidth: 1 },
  userCard: { alignItems: "center", gap: 8, marginBottom: 12, flexDirection: "row" },
  avatar: { width: 72, height: 72, borderRadius: 12, backgroundColor: "linear-gradient(90deg,#1e90ff,#00f0a8)", justifyContent: "center", alignItems: "center" },
  avatarSmall: { width: 40, height: 40, borderRadius: 10, backgroundColor: "#0b0c0f", justifyContent: "center", alignItems: "center" },
  avatarInitial: { color: "#e8e8ea", fontWeight: "800" },
  hello: { color: "#e8e8ea" },
  mutedSmall: { color: "#9aa3ad", fontSize: 12 },
  bold: { fontWeight: "800" },

  primaryBtn: { marginVertical: 8, backgroundColor: "#00f0a8", padding: 12, borderRadius: 10, alignItems: "center" },
  primaryBtnText: { color: "#061015", fontWeight: "800" },

  sideLinks: { marginTop: 12 },
  sideTitle: { fontWeight: "700", color: "#e8e8ea", marginBottom: 8 },
  linkBtn: { paddingVertical: 8 },
  linkText: { color: "#9aa3ad" },

  // composer
  composerCard: { marginBottom: 12, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.01)" },
  composerInput: { color: "#fff", minHeight: 48, flex: 1 },
  composerActions: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  ghostBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.04)" },
  ghostText: { color: "#e8e8ea" },
  primaryBtnSmall: { backgroundColor: "#00f0a8", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, marginLeft: 8 },
  composerInputArea: {},

  previewMedia: { width: "100%", height: 160, borderRadius: 10, marginTop: 8 },

  // post card
  postCard: { padding: 14, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.01)", marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.04)" },
  postMeta: { flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 8 },
  author: { color: "#e8e8ea", fontWeight: "700" },
  postBody: { color: "#e8e8ea", marginTop: 6 },
  postImage: { width: "100%", height: 180, borderRadius: 10, marginTop: 8 },
  postActions: { flexDirection: "row", gap: 8, marginTop: 10 },
  actionBtn: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.04)" },
  actionText: { color: "#e8e8ea" },

  mutedSmall: { color: "#9aa3ad", fontSize: 12 },

  // analytics
  analyticsCard: { padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.01)" },
  analyticsTitle: { color: "#e8e8ea", fontWeight: "700", marginBottom: 8 },
  kpiRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  kpi: { alignItems: "center", padding: 8, backgroundColor: "rgba(255,255,255,0.01)", borderRadius: 8, flex: 1, marginHorizontal: 4 },
  kpiValue: { color: "#1e90ff", fontWeight: "800" },
  kpiLabel: { color: "#9aa3ad", fontSize: 12 },
  feedList: { paddingBottom: 60 },
});