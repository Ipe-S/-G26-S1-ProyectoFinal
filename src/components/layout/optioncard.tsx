"use client";

type OptionCardProps = {
  image: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  // true = ícono chico centrado sobre un círculo de color (ej: drenaje)
  // false = imagen/ícono grande llenando el círculo completo (ej: tipo de suelo)
  iconBackground?: boolean;
};

export default function OptionCard({
  image,
  title,
  description,
  selected,
  onClick,
  iconBackground = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-[237px] flex-col items-center gap-4 rounded-[32px] p-4 text-center shadow-[0px_20px_20px_rgba(15,82,56,0.06)] transition-colors ${
        selected
          ? "bg-[#F4F6F5] border-2 border-[#0F5238 text-[#5a6745]"
          : "bg-white border-2 border-transparent"
      }`}
    >
      {iconBackground ? (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#D7E5BB]">
          <img src={image} alt="" className="h-12 w-12" />
        </span>
      ) : (
        <span className="h-16 w-16 shrink-0 overflow-hidden rounded-full">
          <img src={image} alt="" className="h-full w-full object-cover" />
        </span>
      )}

      <span className="flex flex-col items-center gap-1">
        <span className="text-sm font-semibold uppercase tracking-[0.7px] text-[#0F5238]">
          {title}
        </span>
        <span className="text-sm leading-4 text-[#404943]">{description}</span>
      </span>
    </button>
  );
}