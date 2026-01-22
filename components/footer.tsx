export function Footer() {
  return (
    <footer className="border-t py-8 bg-muted/30 mt-8">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>
          Made with ❤️ by{' '}
          <a
            href="https://github.com/Neet-Nestor"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-primary transition-colors"
          >
            Neet-Nestor
          </a>
          {' '}· 专为ccliu和其他拼豆爱好者们打造
        </p>
      </div>
    </footer>
  );
}
