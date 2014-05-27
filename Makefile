BOOK_NAME=redecouvrir-javascript-avec-nodejs

all: epub html

epub: dist
	cp -r images dist
	pandoc -s content/title.txt content/*.md \
		--epub-metadata=metadata.xml \
		--epub-cover-image=images/cover.jpg \
		-o dist/$(BOOK_NAME).epub

html: dist
	cp -r css dist
	pandoc content/*.md \
		-s --toc \
		-o dist/$(BOOK_NAME).html \
		--variable author-meta="Sébastien Castiel <sebastien.castiel@gmail.com>" \
		--variable title="Redécouvrir JavaScript avec Node.js" \
		--variable pagetitle="Redécouvrir JavaScript avec Node.js" \
		-c "css/style.css" \
		-c "css/github.css" \
		-B html/header.html \
		-A html/footer.html
dist:
	mkdir -p dist

clean:
	rm -Rf dist
