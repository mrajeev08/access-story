PHONY: github

npm2gh:
	npm run deploy
	rm -rf docs
	cp -r dist/ docs
	git add -A
	git commit -m "rebuild and update dev version"
	git push

github:
	rm -rf docs
	cp -r dist/ docs
	git add -A
	git commit -m "update dev version"
	git push

archive:
	zip -r archive.zip dev
	git add -A
	git commit -m "archive"
	git push

client:
	npm run depudding
