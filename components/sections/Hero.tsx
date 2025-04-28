import { Button } from '../ui/button'
import { Highlight } from '../ui/highlight'
import Squares from '../ui/squares'

export const Hero = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10">
        <Squares 
          speed={0.4} 
          squareSize={40}
          direction='diagonal'
          borderColor='#222'
          hoverFillColor='#222'
        />
      </div>
      <div className="relative pt-16 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 8rem)' }}>
        <div className="container mx-auto px-4 text-center flex flex-col items-center">
          <p className="text-5xl text-foreground font-bold mb-8 mx-auto leading-normal">
            Building <Highlight>delightful</Highlight><br /> open source apps.
          </p>
          <Button asChild size="lg" variant="outline">
            <a href="#apps">See Projects</a>
          </Button>
        </div>
      </div>
    </div>
  )
} 