<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:gco="http://www.isotc211.org/2005/gco" xmlns:gmd="http://www.isotc211.org/2005/gmd"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:param name="tab" select="'&#9;'"/>
    <xsl:param name="newline" select="'&#13;&#10;'"/>
    <xsl:output method="text"/>
    <xsl:strip-space elements="*"/>
    <xsl:template match="/">
        <xsl:for-each select="//row[1]/*">
            <xsl:value-of select="name()"/>
            <xsl:choose>
                <xsl:when test="position() = last()">
                    <xsl:value-of select="$newline"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$tab"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
        <xsl:apply-templates select="//row"/>
    </xsl:template>
   
    <xsl:template match="row">
        <xsl:for-each select="*">
            <xsl:value-of select="."/>
            <xsl:choose>
                <xsl:when test="position() = last()">
                    <xsl:value-of select="$newline"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$tab"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>
