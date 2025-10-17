import { Link, usePage, router } from "@inertiajs/react";
import Icon from "../Icon";
import { useAuth } from "../../contexts/AuthContext";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Auth {
  user: User | null;
  token?: string;
}

interface PageProps {
  auth: Auth | null;
  [key: string]: any;
}

const NavBar = () => {
  const { url } = usePage<PageProps>();
  const {
    user,
    signOut,
    getUserDisplayName,
    getUserAvatar,
    getUserEmail,
    isGoogleUser,
  } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.visit("/login");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Recipes", href: "/recipes" },
    { name: "Meal Plans", href: "/meal-plans" },
    { name: "Quiz", href: "/quiz" },
  ];

  const isCurrentPage = (href: string) => {
    if (href === "/") {
      return url === "/";
    }
    return url.startsWith(href);
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure as="nav" className="bg-gray-800 shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 w-full">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <Icon name="close-line" className="text-white" size="lg" />
                  ) : (
                    <Icon name="menu-line" className="text-white" size="lg" />
                  )}
                </DisclosureButton>
              </div>

              {/* Logo and Navigation - Left Side */}
              <div className="flex items-center space-x-6">
                {/* Logo */}
                <Link
                  href="/"
                  className="flex flex-shrink-0 items-center gap-2"
                >
                  <div className="h-10 w-10 bg-gradient-to-r from-gray-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Icon
                      name="restaurant-2-fill"
                      className="text-white"
                      size="xl"
                    />
                  </div>
                  <span className="text-white text-xl font-bold hidden sm:block">
                    PocketChef
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex">
                  <div className="flex space-x-4">
                    {navigation.map((item) => {
                      const current = isCurrentPage(item.href);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right side - User menu */}
              <div className="flex items-center">
                {user ? (
                  <Menu as="div" className="relative ml-3">
                    <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <img
                          src={getUserAvatar()}
                          alt={getUserDisplayName()}
                          className="h-8 w-8 object-cover"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-400 to-blue-500 flex items-center justify-center text-white font-semibold hidden">
                          {getUserDisplayName().charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </MenuButton>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center space-x-3">
                          <img
                            src={getUserAvatar()}
                            alt={getUserDisplayName()}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {getUserEmail()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <MenuItem>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                        >
                          Your Profile
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                        >
                          Settings
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-blue-600 data-[focus]:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/login"
                      className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-gradient-to-r from-gray-500 to-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-gray-600 hover:to-blue-600"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => {
                const current = isCurrentPage(item.href);
                return (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={classNames(
                      current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={current ? "page" : undefined}
                  >
                    {item.name}
                  </DisclosureButton>
                );
              })}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default NavBar;
