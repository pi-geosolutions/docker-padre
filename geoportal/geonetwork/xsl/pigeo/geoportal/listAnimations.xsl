<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="xml" indent="yes"/>

	<xsl:template match="/">
		<animations>
			<xsl:apply-templates select="/root/gui/animations/*"/>
		</animations>
	</xsl:template>
	
	<xsl:template match="datasets">
		<xsl:copy>
			<xsl:for-each select="dataset">
				<dataset>
					<xsl:copy-of select="id"/>
					<xsl:copy-of select="label"/>
					<xsl:copy-of select="SRS"/>
					<xsl:copy-of select="geographicbounds"/>
					<xsl:copy-of select="imagesize"/>
					<xsl:copy-of select="timestampformatter"/>
					<xsl:copy-of select="info"/>
					<xsl:copy-of select="timeextent"/>
					<xsl:copy-of select="timeunit"/>
				</dataset>
			</xsl:for-each>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
