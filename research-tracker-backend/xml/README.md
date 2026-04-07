# XML Validation Guide

Validate `bookstore.xml` against DTD:

```bash
xmllint --dtdvalid bookstore.dtd bookstore.xml
```

Validate `bookstore.xml` against XSD:

```bash
xmllint --schema bookstore.xsd bookstore.xml
```
