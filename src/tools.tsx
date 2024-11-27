import Research from './routes/Research';
import Rank from './routes/Rank';
import ExternalTool from './components/ExternalTool';
import { faMagnifyingGlass, faBullhorn, faBook, faFilePen, faEnvelope, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { scrapeCurrentBook } from './utils/book-scraping';
import Search from './routes/Search';
import Ads from './routes/Ads';
import { faMicroscope } from '@fortawesome/free-solid-svg-icons/faMicroscope';

export const tools = [
  {
    name: 'Research',
    id: 'Research',
    path: '/research',
    icon: faMicroscope,
    element: <Research />
  },
  {
    name: 'Search',
    id: 'Search',
    path: '/search',
    icon: faMagnifyingGlass,
    element: <Search />
  },
  {
    name: 'Ads',
    id: 'Advertising',
    path: '/ads',
    icon: faBullhorn,
    element: <Ads />
  },
  {
    name: 'Rank',
    id: 'Rank',
    path: '/rank',
    icon: faChartLine,
    element: <Rank />,
    loader: async () => {
      await scrapeCurrentBook()
      return null;
    }
  },
  {
    name: 'Covers',
    id: 'PBNify',
    path: '/covers',
    icon: faBook,
    isExternal: true,
    url: `members/software/book-cover-rocket/`,
    title: "Push Button Covers",
    description: "Push Button Covers is a Do-It-Yourself cover image creator that uses proven templates to make beautiful cover images that you can use for your books.",
  },
  {
    name: 'Format',
    id: 'Formatting',
    path: '/format',
    icon: faFilePen,
    isExternal: true,
    url: `members/software/formatter-rocket/`,
    title: "Push Button Formatting",
    description: "Push Button Formatting will turn a standard Microsoft Word document into a well-formatted reflowable ePub that you can upload directly to KDP or other retailers. No software download required."
  },
  {
    name: 'Lists',
    id: 'List',
    path: '/lists',
    icon: faEnvelope,
    isExternal: true,
    url: `members/software/list-rocket/`,
    title: "Push Button Lists",
    description: "Building an email list of true fans will help skyrocket your future launches to the bestseller lists and can help promote your backlist. Push Button Lists makes it very easy to create a landing page that converts readers into subscribers."
  },
]

export const routes = tools.map(tool => {
  const element = tool.isExternal ? <ExternalTool {...tool} /> : tool.element || <div>{tool.name}</div>
  return {
    ...tool,
    element,
  }
})

export default tools;