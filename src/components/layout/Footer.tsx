import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <p className="text-xs text-muted-foreground">
              © 2024 TITANIS™ Platform (BETA). Powered by{" "}
              <a
                href="https://www.titanideconsulting.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                Titanide Consulting Group
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>
      <Separator />
    </footer>
  );
}