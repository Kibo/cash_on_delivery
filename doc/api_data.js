define({ api: [
  {
    "type": "delete",
    "url": "/delete/:id",
    "title": "Delete",
    "version": "0.4.0",
    "group": "Document",
    "name": "DeleteDocument",
    "description": "Delete the document",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "id",
            "optional": false,
            "description": "Document id value"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "field": "Success",
            "optional": false,
            "description": "The document has been deleted."
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "field": "BadRequest",
            "optional": false,
            "description": "The request had bad syntax."
          }
        ],
        "404": [
          {
            "group": "404",
            "field": "NotFound",
            "optional": false,
            "description": "The <code>id</code> of the document was not found."
          }
        ]
      }
    },
    "examples": [
      {
        "title": "CURL usage:",
        "content": "curl -i -X DELETE http://HOST/delete/536a4a09617b0235489842ae\n"
      }
    ],
    "filename": "routes/index.js"
  },
  {
    "type": "delete",
    "url": "/old/delete",
    "title": "Old_Delete",
    "version": "0.4.0",
    "group": "Document",
    "name": "DeleteOldDocuments",
    "description": "Delete old documents",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "field": "Success",
            "optional": false,
            "description": "Get reprezentation of old documents."
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "field": "BadRequest",
            "optional": false,
            "description": "The request had bad syntax."
          }
        ],
        "404": [
          {
            "group": "404",
            "field": "NotFound",
            "optional": false,
            "description": "No documents."
          }
        ]
      }
    },
    "examples": [
      {
        "title": "CURL usage:",
        "content": "curl -i -X delete http://HOST/old/delete\n"
      }
    ],
    "filename": "routes/index.js"
  },
  {
    "type": "get",
    "url": "/all",
    "title": "All",
    "version": "0.4.0",
    "group": "Document",
    "name": "GetAllDocuments",
    "description": "Get all documents",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "field": "Success",
            "optional": false,
            "description": "Get reprezentation of all documents."
          }
        ]
      }
    },
    "examples": [
      {
        "title": "CURL usage:",
        "content": "curl -i http://HOST/all\n"
      }
    ],
    "filename": "routes/index.js"
  },
  {
    "type": "get",
    "url": "/get/:id/:reprezentation?",
    "title": "Get",
    "version": "0.4.0",
    "group": "Document",
    "name": "GetDocument",
    "description": "Get the reprezentation of the document.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "id",
            "optional": false,
            "description": "Document id value"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "reprezentation",
            "defaultValue": "data",
            "optional": true,
            "description": "data | preview | print"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "field": "Success",
            "optional": false,
            "description": "Get a reprezentation of the document."
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "field": "BadRequest",
            "optional": false,
            "description": "The request had bad syntax."
          }
        ],
        "404": [
          {
            "group": "404",
            "field": "NotFound",
            "optional": false,
            "description": "The <code>id</code> of the document was not found."
          }
        ]
      }
    },
    "examples": [
      {
        "title": "CURL usage:",
        "content": "curl -i -X GET http://HOST/get/536a4a09617b0235489842ae/preview\n"
      }
    ],
    "filename": "routes/index.js"
  },
  {
    "type": "get",
    "url": "/old",
    "title": "Old",
    "version": "0.4.0",
    "group": "Document",
    "name": "GetOldDocuments",
    "description": "Get old documents",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "field": "Success",
            "optional": false,
            "description": "Get reprezentation of old documents."
          }
        ]
      }
    },
    "examples": [
      {
        "title": "CURL usage:",
        "content": "curl -i http://HOST/old\n"
      }
    ],
    "filename": "routes/index.js"
  },
  {
    "type": "post",
    "url": "/save",
    "title": "Save",
    "version": "0.4.0",
    "group": "Document",
    "name": "SaveDocument",
    "description": "Save the document.",
    "parameter": {
      "fields": {
        "Important! For correct field name look at  column with name 'Description'. (ApiDoc tool does not support such field name.)": [
          {
            "group": "note",
            "type": "String",
            "field": "sender_firstname",
            "optional": false,
            "description": "sender[firstname]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "sender_lastname",
            "optional": false,
            "description": "sende[lastname]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "sender_street",
            "optional": false,
            "description": "sender[street]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "sender_city",
            "optional": false,
            "description": "sender[city]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "sender_zip",
            "optional": false,
            "description": "sender[zip]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "sender_phone",
            "optional": false,
            "description": "sender[phone]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "sender_email",
            "optional": false,
            "description": "sender[email]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "bank_purpose_of_payment",
            "optional": true,
            "description": "bank[purpose_of_payment]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "bank_account_number",
            "optional": false,
            "description": "bank[account_number]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "bank_variable_symbol",
            "optional": false,
            "description": "bank[variable_symbol]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "bank_specific_symbol",
            "optional": true,
            "description": "bank[specific_symbol]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "bank_constant_symbol",
            "optional": true,
            "description": "bank[constant_symbol]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "bank_amount_number",
            "optional": false,
            "description": "bank[amount_number]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "recipient_firstname",
            "optional": false,
            "description": "recipient[firstname]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "recipient_lastname",
            "optional": false,
            "description": "recipient[lastname]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "recipient_streetname",
            "optional": false,
            "description": "recipient[streetname]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "recipient_city",
            "optional": false,
            "description": "recipient[city]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "recipient_zip",
            "optional": false,
            "description": "recipient[zip]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "recipient_phone",
            "optional": false,
            "description": "recipient[phone]"
          },
          {
            "group": "note",
            "type": "String",
            "field": "recipient_email",
            "optional": false,
            "description": "recipient[email]"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "field": "Success",
            "optional": false,
            "description": "Success and redirect."
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "field": "BadRequest",
            "optional": false,
            "description": "Validation error."
          }
        ]
      }
    },
    "examples": [
      {
        "title": "CURL usage:",
        "content": "curl -i -X POST http://HOST/save --data 'sender%5Bfirstname%5D=Tomas&sender%5Blastname%5D=Jurman&sender%5Bstreet%5D=T%C5%99eb%C3%ADzsk%C3%A9ho+4&sender%5Bcity%5D=Znojmo&sender%5Bzip%5D=66902&sender%5Bphone%5D=728+435+724&sender%5Bemail%5D=tomasjurman%40gmail.com&bank%5Bpurpose_of_payment%5D=Spl%C3%A1tka&bank%5Baccount_number%5D=98-123456789%2F0800&bank%5Bvariable_symbol%5D=456&bank%5Bspecific_symbol%5D=123&bank%5Bconstant_symbol%5D=789&bank%5Bamount_number%5D=2289&recipient%5Bfirstname%5D=Petr&recipient%5Blastname%5D=Bundakundapakunda&recipient%5Bstreet%5D=Bolz%C3%A1nova+18&recipient%5Bcity%5D=Praha&recipient%5Bzip%5D=36958&recipient%5Bphone%5D=124+563+789&recipient%5Bemail%5D=petrbunda%40email.com&reprezentation=preview'\n"
      }
    ],
    "filename": "routes/index.js"
  }
] });