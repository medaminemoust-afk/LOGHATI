import { Icon, type IconName } from "./icons";

export type Tab = "learn" | "review" | "profile";

const items: { tab: Tab; label: string; icon: IconName }[] = [
  { tab: "learn", label: "Learn", icon: "book" },
  { tab: "review", label: "Review", icon: "review" },
  { tab: "profile", label: "You", icon: "user" },
];

export default function Nav({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="nav" aria-label="Main">
      {items.map((item) => (
        <button
          key={item.tab}
          type="button"
          className={item.tab === tab ? "active" : ""}
          onClick={() => onChange(item.tab)}
          aria-current={item.tab === tab ? "page" : undefined}
        >
          <Icon name={item.icon} size={20} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
