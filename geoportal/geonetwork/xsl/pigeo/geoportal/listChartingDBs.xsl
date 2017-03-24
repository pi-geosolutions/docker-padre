<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="xml" indent="yes"/>

	<xsl:template match="/">
		<chartsInfo>
			<xsl:apply-templates select="/root/gui/charts/*"/>
		</chartsInfo>
	</xsl:template>
	
	<xsl:template match="DBs">
		<xsl:copy>
			<xsl:for-each select="db">
				<db>
					<xsl:copy-of select="id"/>
					<xsl:copy-of select="label"/>
				</db>
			</xsl:for-each>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
