import { ShoppingCart, Menu, Search, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/NavLink";
import { SearchDialog } from "@/components/SearchDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, isJournalist, signOut } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <span className="text-xl font-bold text-white">ТК</span>
              </div>
              <span className="text-xl font-bold text-foreground">ТеплоКомфорт</span>
            </NavLink>

            <nav className="hidden lg:flex items-center gap-6">
              <NavLink
                to="/"
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                activeClassName="text-foreground"
              >
                Главная
              </NavLink>
              <NavLink
                to="/catalog"
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                activeClassName="text-foreground"
              >
                Каталог
              </NavLink>
              <NavLink
                to="/about"
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                activeClassName="text-foreground"
              >
                О нас
              </NavLink>
              <NavLink
                to="/contact"
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                activeClassName="text-foreground"
              >
                Контакты
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex"
            >
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <>
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {itemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/cart")}>
                      Корзина
                    </DropdownMenuItem>
                    {(isAdmin || isJournalist) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/admin")}>
                          <Shield className="mr-2 h-4 w-4" />
                          Админ-панель
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} size="sm">
                Войти
              </Button>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4">
                  <NavLink
                    to="/"
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Главная
                  </NavLink>
                  <NavLink
                    to="/catalog"
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Каталог
                  </NavLink>
                  <NavLink
                    to="/about"
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    О нас
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Контакты
                  </NavLink>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};
