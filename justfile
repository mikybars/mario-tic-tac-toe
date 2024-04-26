# Dependencies:
#   npm
#   netlify cli -- https://docs.netlify.com/cli/get-started/

publish_dir := "dist"

[private]
default:
	@just --list

# run vite build
build:
	npm run build

# build & deploy to production
deploy: build
	netlify deploy --prod --dir={{publish_dir}}

# build & deploy a preview (see https://docs.netlify.com/site-deploys/deploy-previews)
deploy-preview: build
	netlify deploy --dir={{publish_dir}}

# show deploy status
deploy-status:
	netlify status
