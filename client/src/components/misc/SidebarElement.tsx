import { IconType } from "react-icons";
import Link from "next/link";
export default function SidebarElement({
	Icon,
	pathname,
	name,
	setShowSidebar,
}: {
	Icon: IconType;
	pathname: string;
	name: string;
	setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<Link
			href={"/" + name}
			onClick={() => setShowSidebar(false)}
			className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-cool-grey-700 hover:bg-gray-100 relative ${
				pathname.startsWith("/" + name)
					? "after:absolute after:content-[' '] after:block after:top-0 after:left-0 after:bg-blue-500 after:w-1 after:h-full"
					: ""
			} `}
		>
			<Icon className="size-5"></Icon>
			<h3 className="capitalize">{name}</h3>
		</Link>
	);
}
