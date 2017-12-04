export function recursiveDiffer ( a, b, pathPrefix, asymmetrical ) {
	var keys, resultArray = [];

	pathPrefix = pathPrefix || [];

	if ( a === b ) {
		return [];
	}

	a = a || {};
	b = b || {};

	keys = Object.keys( a )
		.concat( Object.keys( b ) )
		// Remove duplicates
		.reduce( function ( result, k ) {
			if ( result.indexOf( k ) === -1 ) {
				result.push( k );
			}
			return result;
		}, [] );

	keys.forEach( function ( k ) {
		var aValue = a[ k ],
			bValue = b[ k ],
			aType = typeof aValue,
			bType = typeof bValue,
			path = pathPrefix.concat( [ k ] );


		if ( aType !== bType ||
			(
				( aType === 'string' || aType === 'number' || aType === 'boolean' ) &&
				aValue !== bValue
			)
		) {
			resultArray.push( path );
		} else {
			resultArray = resultArray.concat(
				recursiveDiffer( aValue, bValue, path, true )
			);
		}
	} );
	return resultArray;
};
