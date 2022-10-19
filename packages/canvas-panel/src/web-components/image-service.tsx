import { h } from 'preact';
import register from '../library/preact-custom-element';
import { NestedAtlas } from '../components/NestedAtlas/NestedAtlas';
import { RenderImage } from '../components/RenderImage/RenderImage';
import { ImageWithOptionalService, useLoadImageService, VaultProvider } from 'react-iiif-vault';
import { useMemo } from 'preact/compat';
import { ErrorFallback } from '../components/ErrorFallback/ErrorFallback';
import { ErrorBoundary as _ErrorBoundary } from 'react-error-boundary';
import { useGenericAtlasProps } from '../hooks/use-generic-atlas-props';
import { GenericAtlasComponent } from '../types/generic-atlas-component';

const ErrorBoundary = _ErrorBoundary as any;

type ImageServiceApi = {
  //
};

export type ImageServiceProps = GenericAtlasComponent<
  {
    src: string;
    nested?: string;
    x?: number;
    y?: number;
    tileFormat?: string;
  },
  ImageServiceApi
>;

export function ImageService(props: ImageServiceProps) {
  const {
    atlasProps,
    isConfigBlocking,
    setIsReady,
    preferredFormats, // @todo use.
    virtualSizes,
    height,
    width,
    className,
    inlineStyles,
    inlineStyleSheet,
    viewport,
    vault,
    useProp,
    interactive,
    x,
    y,
  } = useGenericAtlasProps(props);

  const [src] = useProp('src');
  const [tileFormat, setTileFormat] = useProp('tileFormat');
  const [loadImageService, status] = useLoadImageService();
  const statusOf = status[src];
  const image = useMemo(() => {
    const service = loadImageService({ id: src } as any, {} as any);

    if (service && (service as any).preferredFormats && (service as any).preferredFormats.length === 1) {
      setTileFormat((service as any).preferredFormats[0]);
    }

    if (service && service.height && service.width && statusOf !== 'loading') {
      return {
        id: src,
        width: service.width,
        height: service.height,
        service,
        type: 'Image',
        selector: {
          type: 'BoxSelector',
          spatial: {
            x: 0,
            y: 0,
            width: service.width,
            height: service.height,
          },
        },
        target: {
          type: 'BoxSelector',
          spatial: {
            x: 0,
            y: 0,
            width: service.width,
            height: service.height,
          },
        },
      } as ImageWithOptionalService;
    }

    return null;
  }, [status]);

  if (!image || !image.height || !image.width || isConfigBlocking) {
    return null;
  }

  const aspectRatio = !viewport
    ? atlasProps.homePosition
      ? atlasProps.homePosition.width / atlasProps.homePosition.height
      : image.width / image.height
    : undefined;

  return (
    <ErrorBoundary
      fallbackRender={(props: any) => (
        <ErrorFallback height={height} width={width} aspectRatio={aspectRatio} {...props} />
      )}
    >
      <VaultProvider vault={vault}>
        <NestedAtlas
          onCreated={() => {
            setIsReady(true);
          }}
          viewport={true}
          aspectRatio={aspectRatio}
          className={className}
          {...atlasProps}
        >
          <RenderImage
            key={image.id}
            image={image}
            id={image.id}
            isStatic={!interactive}
            virtualSizes={virtualSizes}
            x={x}
            y={y}
            tileFormat={tileFormat}
          />
        </NestedAtlas>
      </VaultProvider>
      {inlineStyles ? <style>{inlineStyles}</style> : null}
      {inlineStyleSheet ? <link rel="stylesheet" href={inlineStyleSheet} /> : null}
    </ErrorBoundary>
  );
}

if (typeof window !== 'undefined') {
  register(
    ImageService,
    'image-service',
    [
      'src',
      'nested',
      'x',
      'y',
      'width',
      'height',
      'target',
      'region',
      'highlight',
      'highlight-css-class',
      'text-selection-enabled',
      'disable-keyboard-navigation',
      'click-to-enable-zoom',
      'preferred-formats',
      'atlas-mode',
      'style-id',
      'debug',
      'preset',
      'responsive',
      'interactive',
      'iiif-content',
      'class',
      'choice-id',
      'move-events',
      'granular-move-events',
      'tile-format',
    ],
    {
      shadow: true,
      onConstruct(instance: any) {
        instance._props = {
          __registerPublicApi: (api: any) => {
            Object.assign(instance, api(instance));
          },
        };
      },
    } as any
  );
}
