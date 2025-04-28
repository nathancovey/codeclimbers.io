import { LinkedInIcon } from '../icons/LinkedInIcon'
import { XIcon } from '../icons/XIcon'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 border-t">
      <div className="container mx-auto px-4 text-sm text-muted-foreground flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <p>&copy; {currentYear} Extremely Bad Builders LLC</p>
          <span className="mx-1">&middot;</span>
          <a 
            href="https://github.com/CodeClimbersIO#mit-license" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >
            MIT License
          </a>
        </div>
        <div className="flex items-center gap-4 self-start md:self-center">
          <a
            href="https://www.linkedin.com/company/codeclimberslfg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="CodeClimbers on LinkedIn"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
          <a
            href="https://x.com/codeclimbersio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="CodeClimbers on X"
          >
            <XIcon className="inline-flex items-center justify-center h-5 w-5 bg-muted-foreground rounded-none text-background hover:bg-foreground transition-colors text-sm font-semibold" />
          </a>
        </div>
      </div>
    </footer>
  )
} 