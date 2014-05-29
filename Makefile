BOOK_NAME=redecouvrir-javascript-avec-nodejs

all: epub html pdf

html: dist/$(BOOK_NAME).html

pdf: dist/$(BOOK_NAME).pdf

epub: dist/$(BOOK_NAME).epub

dist/$(BOOK_NAME).epub: content/title.txt content/*.md metadata.xml images/cover.jpg
	mkdir -p dist
	cp -r images dist
	pandoc -s content/title.txt content/*.md \
		--epub-metadata=metadata.xml \
		--epub-cover-image=images/cover.jpg \
		-o dist/$(BOOK_NAME).epub

dist/$(BOOK_NAME).html: content/title.txt content/*.md html/header.html html/footer.html css/style.css css/github.css
	mkdir -p dist
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

dist/$(BOOK_NAME).pdf: content/title.txt content/*.md
	mkdir -p dist
	pandoc -s content/title.txt content/*.md \
		-o dist/$(BOOK_NAME).pdf

clean:
	rm -Rf dist
