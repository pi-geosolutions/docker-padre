<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:geonet="http://www.fao.org/geonetwork" xmlns:gco="http://www.isotc211.org/2005/gco"
  xmlns:gmx="http://www.isotc211.org/2005/gmx" 
  xmlns:gmd="http://www.isotc211.org/2005/gmd" version="2.0">
  
	<!-- ============================================================================= -->

	<!--  give a pattern that the URL should contain in order to be concerned by the fix -->
	<xsl:param name="pattern"/>
	
	<!-- ============================================================================= -->
  
   <!-- Adds a description to DOWNLADABLE files, when missing -->
    <xsl:template match="gmd:CI_OnlineResource[contains(gmd:protocol/gco:CharacterString, 'DOWNLOAD')]" priority="2">
    	<xsl:choose>
         <xsl:when test="gmd:description/gco:CharacterString[not(*) and not(normalize-space())]">
           <xsl:copy>
         		<xsl:copy-of select="*[not(self::gmd:description)]"/>
	      		<gmd:description>
					<gco:CharacterString><xsl:value-of select="gmd:name/gmx:MimeFileType"/></gco:CharacterString>
				</gmd:description>
    		</xsl:copy>
         </xsl:when>
         <xsl:otherwise>
           <xsl:copy>
	      		<xsl:apply-templates select="@*|node()"/>
    		</xsl:copy>
         </xsl:otherwise>
       </xsl:choose>
    </xsl:template>
    
    
    <!-- Fixes WMS resources when setup by Philippe : removes the layer name from the url and puts it in gmd:name tag, and moves the gmd:name tag to gmd:description-->
    <xsl:template match="gmd:CI_OnlineResource[contains(gmd:protocol/gco:CharacterString, 'WMS')]" priority="3">
    	<xsl:variable name="url" select="substring-before(gmd:linkage/gmd:URL, 'layers=')"/>
    	<xsl:variable name="name" select="substring-after(gmd:linkage/gmd:URL, 'layers=')"/>
    	<xsl:choose>
         <xsl:when test="gmd:description/gco:CharacterString[not(*) and not(normalize-space())]">
           <xsl:copy>
         		<xsl:copy-of select="*[not(self::gmd:description) and not(self::gmd:linkage) and not(self::gmd:name)]"/>
         		<gmd:linkage><gmd:URL><xsl:value-of select="$url"/></gmd:URL></gmd:linkage>
         		<gmd:name><gco:CharacterString><xsl:value-of select="$name"/></gco:CharacterString></gmd:name>
	      		<gmd:description>
					<gco:CharacterString><xsl:value-of select="gmd:name/gco:CharacterString"/></gco:CharacterString>
				</gmd:description>
    		</xsl:copy>
         </xsl:when>
         <xsl:otherwise>
           <xsl:copy>
	      		<xsl:apply-templates select="@*|node()"/>
    		</xsl:copy>
         </xsl:otherwise>
       </xsl:choose>
    </xsl:template>
    
    <!-- Fixes namespace-in-layer-name WMS resources pb when setup by Philippe : 
			moves the namespace prefix, when located in layer name, to the URL. Applies only to [pattern]ed (e.g. "pigeo") URLs
			in order not to break anything -->
    <xsl:template match="gmd:CI_OnlineResource[contains(gmd:protocol/gco:CharacterString, 'WMS')]" priority="4">
    	<xsl:choose>
         <xsl:when test=".[contains(gmd:linkage/gmd:URL, $pattern) and contains(gmd:name/gco:CharacterString, ':')] ">
    		<xsl:variable name="webapp" select="substring-before(gmd:linkage/gmd:URL, 'wms?')"/>
    		<xsl:variable name="ns" select="substring-before(gmd:name/gco:CharacterString, ':')"/>
    		<xsl:variable name="shortname" select="substring-after(gmd:name/gco:CharacterString, ':')"/>
           <xsl:copy>
         		<xsl:copy-of select="*[not(self::gmd:linkage) and not(self::gmd:name)]"/>
         		<gmd:linkage><gmd:URL><xsl:value-of select="$webapp"/><xsl:value-of select="$ns"/>/wms?</gmd:URL></gmd:linkage>
         		<gmd:name><gco:CharacterString><xsl:value-of select="$shortname"/></gco:CharacterString></gmd:name>
	      	</xsl:copy>
         </xsl:when>
         <xsl:otherwise>
           <xsl:copy>
	      		<xsl:apply-templates select="@*|node()"/>
    		</xsl:copy>
         </xsl:otherwise>
       </xsl:choose>
    </xsl:template>
    
    
  
   <!-- Do a copy of every nodes and attributes -->
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

  <!-- Remove geonet:* elements. -->
  <xsl:template match="geonet:*" priority="2"/>

</xsl:stylesheet>