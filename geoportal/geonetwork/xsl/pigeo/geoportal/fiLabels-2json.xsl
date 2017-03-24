<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<!--
  Jean Pommier
  jean.pommier@pi-geosolutions.fr
  
  We don't escape double quote. Be careful !!!
-->

  <xsl:output indent="no" omit-xml-declaration="yes" method="text" encoding="UTF-8" media-type="text/x-json"/>

  <xsl:template match="*[name()='children']">
    <xsl:variable name="el" select="name()"/>
    <xsl:if test="not(preceding-sibling::*)">{</xsl:if>
    "<xsl:value-of select="layername"/>":<xsl:value-of select="json"/>
    <xsl:choose>
         <xsl:when test="not(following-sibling::*)">
           }
         </xsl:when>
         <xsl:otherwise>
          ,
         </xsl:otherwise>
       </xsl:choose>
  </xsl:template>  
  
  <!-- convert root element to an anonymous container -->
  <xsl:template match="/">
    <xsl:apply-templates select="/root/response/list/*"/>
  </xsl:template>
    
</xsl:stylesheet>