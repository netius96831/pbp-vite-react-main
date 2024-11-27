// import fontawesome icon type
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

import { user } from '../utils/auth'

function ExternalTool({url, /* icon, */ title, description}: {url: string, icon:  IconDefinition, title: string, description: string}) {
  const baseUrl = user.value.loginType == 'jay-boyer' ? 'https://jayboyerproducts.com' : 'https://apexauthors.com'

  return (
    <div className="text-center flex flex-col gap-6 py-6">
      <div className="text-3xl">{title}</div>
      <div className="text-sm max-w-md mx-auto leading-4 font-light">{description}</div>
      {/* TODO - make reusable button component */}
      <a href={`${baseUrl}/${url}`} target="_blank" className="flex justify-center p-2 bg-sky-700 hover:bg-sky-500 !text-white">
        Visit Tool Page
      </a>
    </div>
  )
}

export default ExternalTool;