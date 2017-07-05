(function() {

  goog.provide('app.admin.layertree.service');

  var module = angular.module('app.admin.layertree.service', []);

  module.service('appAdminLayertreeService', [
    '$translate',
    '$timeout',

    function($translate, $timeout) {

    var propToKeepAsXml = ['children', 'id', 'parentid', 'weight', 'isfolder',
      'lastchanged', 'group', 'legend'];

    var prepareNode = function(node) {
      var json = [];
      var weight = 0;
      for(var p in node) {
        if(angular.isString(node[p])) {
          node[p] = escapeXml(node[p]);
        }
        node.isfolder = node.type == 'folder' ? 'y' : 'n';
        if(propToKeepAsXml.indexOf(p) < 0) {
          if(angular.isString(node[p])) {
            json.push('"' + p + '":"' + node[p] + '"');
          }
          else {
            json.push('"' + p + '":' + node[p]);
          }
          delete node[p];
        }
      }
      node.jsonextensions = json.join(',');
      if(node.children) {
        node.children.forEach(function(n) {
          n.weight = weight++;
          prepareNode(n);
        });
      }
    };

    this.getTreeAsXml = function(tree, name) {
      this.removeParent(tree);
      prepareNode(tree);
      var xml = '<tree><name>Backup ' + name + '</name>' + json2xml(tree) + '</tree>';
      return xml;
    };

    this.removeParent = function(node) {
      delete node.parent;
      if(node.children) {
        node.children.forEach(function(n) {
          this.removeParent(n);
        }, this);
      }
    };

    /**
     * set a reference to the parent node in the layer tree
     * @param {object} node
     * @param {object|undefined} parent
     */
    this.setParent = function(node, parent) {
      node.parent = parent;
      if(node.children) {
        node.children.forEach(function(n) {
          this.setParent(n, node);
        }, this);
      }
    };

    this.computeWeight = function(node) {
      var weight = 0;
      if(node.children) {
        node.children.forEach(function(c) {
          c.weight = weight++;
          this.computeWeight(c);
        }.bind(this));
      }
    };

    this.addToLog = function(msg, type, selector) {
      var p = '<p' + (type ? ' class="text-'+ type + '"' : '') +
          '>' + $translate.instant(msg) + '</p>';

      $timeout(function() {
        var div = $(selector);
        if(div.length) {
          div.scrollTop(div[0].scrollHeight);
        }
      });
      return p;
    };

    function json2xml(o, tab) {
      var toXml = function(v, name, ind) {
        var xml = "";
        if (v instanceof Array) {
          for (var i=0, n=v.length; i<n; i++)
            xml += ind + toXml(v[i], name, ind+"\t") + "\n";
        }
        else if (typeof(v) == "object") {
          var hasChild = false;
          xml += ind + "<" + name;
          for (var m in v) {
            if (m.charAt(0) == "@")
              xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
            else
              hasChild = true;
          }
          xml += hasChild ? ">" : "/>";
          if (hasChild) {
            for (var m in v) {
              if (m == "#text")
                xml += v[m];
              else if (m == "#cdata")
                xml += "<![CDATA[" + v[m] + "]]>";
              else if (m.charAt(0) != "@")
                xml += toXml(v[m], m, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
          }
        }
        else {
          xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
        }
        return xml;
      }, xml="";
      for (var m in o)
        xml += toXml(o[m], m, "");
      return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
    };

    function escapeXml(unsafe) {
      return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '\'': return '&apos;';
          case '"': return '&quot;';
        }
      });
    };

  }]);
})();
