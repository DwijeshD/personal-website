import { HOME_HTML }   from './home'
import { ABOUT_MD }    from './about'
import { STYLES_CSS }  from './styles'
import { SKILLS_JSON } from './skills'
import { SERVER_TS }   from './server'
import { README_MD }   from './readme'

export const DEFAULT_CONTENT: Record<string, string> = {
  'home.html':   HOME_HTML,
  'about.md':    ABOUT_MD,
  'styles.css':  STYLES_CSS,
  'skills.json': SKILLS_JSON,
  'server.ts':   SERVER_TS,
  'readme.md':   README_MD,
}
