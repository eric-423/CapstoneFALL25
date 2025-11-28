import { ComboCard } from "@/components/common/card";
import { Combo } from "@/apis/combo.api";

type ComboListProps = {
  combos: Combo[];
};

const ComboList = ({ combos }: ComboListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {combos.map((combo) => (
        <ComboCard key={combo.comboId} item={combo} />
      ))}
    </div>
  );
};

export default ComboList;

