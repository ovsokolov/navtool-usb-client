//export const GET_ORDDERS = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:networksolutions:apis"><soapenv:Header><urn:SecurityCredential><urn:Application>NavToolAPI</urn:Application><urn:Certificate>7f4cd7af3f80462c93449856d4225a1b</urn:Certificate><urn:UserToken>Cm49EyQp8z2RYe75Hda6X3ZoSt9k6T7K</urn:UserToken></urn:SecurityCredential></soapenv:Header><soapenv:Body><urn:ReadOrderRequest><urn:DetailSize>Large</urn:DetailSize><urn:FilterList><urn:Field>Status.OrderStatusId</urn:Field><urn:Operator>Equal</urn:Operator><urn:ValueList>1</urn:ValueList></urn:FilterList></urn:ReadOrderRequest></soapenv:Body></soapenv:Envelope>';
export const GET_ORDDERS = '<soapenv:Envelope \
xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" \
xmlns:urn="urn:networksolutions:apis">\
 <soapenv:Header>\
 <urn:SecurityCredential>\
 <urn:Application>NavToolAPI</urn:Application>\
<urn:Certificate>7f4cd7af3f80462c93449856d4225a1b</urn:Certificate>\
 <urn:UserToken>Cm49EyQp8z2RYe75Hda6X3ZoSt9k6T7K</urn:UserToken>\
 </urn:SecurityCredential>\
 </soapenv:Header>\
 <soapenv:Body>\
 	<urn:ReadOrderRequest>\
 		<urn:DetailSize>Large</urn:DetailSize>\
 	 	<urn:FilterList>\
			<urn:Field>Status.OrderStatusId</urn:Field>\
			<urn:Operator>Equal</urn:Operator>\
			<urn:ValueList>1</urn:ValueList>\
		</urn:FilterList>\
	</urn:ReadOrderRequest>\
 </soapenv:Body>\
</soapenv:Envelope>';